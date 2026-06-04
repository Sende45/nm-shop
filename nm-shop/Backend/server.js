// Étape 1 : Charger dotenv TOUT EN HAUT pour injecter les variables avant toute initialisation
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// Importation de ta configuration Firebase partagée
import { db } from './config/firebase.js';

// Configuration de Stripe en mode module ES
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configuration de FedaPay (Mobile Money Orange, MTN, Moov, Wave)
import fedapayPkg from 'fedapay';
const { FedaPay, Transaction } = fedapayPkg;

const app = express();
const PORT = process.env.PORT || 5000;

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment('live'); // 'sandbox' pour les tests, 'live' pour la production en Côte d'Ivoire

// -------------------------------------------------------------------------
// 1. WEBHOOK STRIPE : Écoute les paiements CB réussis en arrière-plan
// CRITICAL : Doit rester impérativement AVANT app.use(express.json())
// -------------------------------------------------------------------------
app.post('/webhook-stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`[ERREUR WEBHOOK STRIPE] : ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;
    const cartItems = JSON.parse(metadata.cartItems);

    await executerComptabiliteAutomatique({
      customerName: session.customer_details.name || "Client Stripe",
      customerPhone: session.customer_details.phone || "Non renseigné",
      totalAmount: session.amount_total / 100, 
      gateway: 'stripe',
      gatewayId: session.id,
      items: cartItems
    });
  }
  res.json({ received: true });
});

// Activation des middlewares pour l'ensemble des autres routes de l'API NoMar
app.use(cors({ origin: true }));
app.use(express.json());

// -------------------------------------------------------------------------
// 2. ROUTE : Création automatique d'une session Stripe Checkout (Carte)
// -------------------------------------------------------------------------
app.post('/api/payment/stripe', async (req, res) => {
  const { cart, customer } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map(item => ({
        price_data: {
          currency: 'xof',
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: {
        cartItems: JSON.stringify(cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })))
      },
      success_url: 'https://nomar.ci/panier?status=success',
      cancel_url: 'https://nomar.ci/panier?status=cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// 3. ROUTE : Création automatique d'un lien Mobile Money FedaPay
// -------------------------------------------------------------------------
app.post('/api/payment/fedapay', async (req, res) => {
  const { amount, customer, cart } = req.body;

  try {
    const transaction = await Transaction.create({
      description: 'Achat Riz Premium NoMar',
      amount: amount,
      currency: { iso: 'XOF' },
      callback_url: 'https://nomar.ci/panier?status=success',
      customer: {
        firstname: customer.name,
        email: customer.email,
        phone_number: { number: customer.phone, country: 'CI' }
      }
    });

    const token = await transaction.generateToken();
    
    // Structure stricte et propre du panier pour éviter les anomalies d'ID dans Firestore
    const formattedItems = cart.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price
    }));

    await db.collection('transactions').doc(`feda_${transaction.id}`).set({
      customerName: customer.name,
      customerPhone: customer.phone,
      totalAmount: amount,
      gateway: 'fedapay',
      status: 'pending',
      items: formattedItems,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ url: token.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// 4. WEBHOOK FEDAPAY : Écoute les validations de paiements Mobile Money
// -------------------------------------------------------------------------
app.post('/webhook-fedapay', async (req, res) => {
  const event = req.body;

  if (event.entity === 'transaction' && event.status === 'approved') {
    const fedaTxId = event.id;
    const transactionDocRef = db.collection('transactions').doc(`feda_${fedaTxId}`);
    const docSnap = await transactionDocRef.get();

    if (docSnap.exists() && docSnap.data().status === 'pending') {
      const txData = docSnap.data();

      await transactionDocRef.update({
        status: 'completed',
        gatewayId: fedaTxId,
        paymentDate: admin.firestore.FieldValue.serverTimestamp(),
        monthYear: `${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`
      });

      await executerComptabiliteAutomatique({
        customerName: txData.customerName,
        customerPhone: txData.customerPhone,
        totalAmount: txData.totalAmount,
        gateway: 'fedapay',
        gatewayId: fedaTxId,
        items: txData.items
      }, true);
    }
  }
  res.status(200).send('Webhook FedaPay Traité');
});

// -------------------------------------------------------------------------
// 5. FONCTION MUTUALISÉE : Gère les stocks et calcule le CA mensuel automatiquement
// -------------------------------------------------------------------------
async function executerComptabiliteAutomatique(data, isFeda = false) {
  const currentMonth = `${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`;
  const batch = db.batch();

  if (!isFeda) {
    const txRef = db.collection('transactions').doc();
    batch.set(txRef, {
      ...data,
      status: 'completed',
      paymentDate: admin.firestore.FieldValue.serverTimestamp(),
      monthYear: currentMonth
    });
  }

  const analyticsRef = db.collection('analytics').doc(currentMonth);
  batch.set(analyticsRef, {
    monthYear: currentMonth,
    totalRevenue: admin.firestore.FieldValue.increment(data.totalAmount),
    ordersCount: admin.firestore.FieldValue.increment(1),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  data.items.forEach(item => {
    if (item.id) { // Protection pour s'assurer que le produit possède un identifiant valide
      const productRef = db.collection('products').doc(item.id);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.quantity)
      });
    }
  });

  await batch.commit();
  console.log(`[AUTOMATISATION NOMAR] Commande traitée, stock déduit et CA mis à jour pour le mois ${currentMonth}`);
}

app.listen(PORT, () => console.log(`Serveur NoMar connecté et automatisé sur le port ${PORT}`));