// Étape 1 : Charger dotenv TOUT EN HAUT pour éviter l'erreur "replace of undefined"
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

// Importation de ta configuration Firebase initialisée et sécurisée
import { db, admin } from './config/firebase.js'; 

// Importation et configuration des passerelles de paiement
import Stripe from 'stripe';
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ Erreur : La clé secrète STRIPE_SECRET_KEY est manquante.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import fedapayPkg from 'fedapay';
const { FedaPay, Transaction, Webhook } = fedapayPkg;

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration de la passerelle Mobile Money FedaPay
FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment('live'); // 'sandbox' pour les tests, 'live' pour la production réelle en Côte d'Ivoire

// -------------------------------------------------------------------------
// 1. WEBHOOK STRIPE : Écoute les validations de paiement par Carte Bancaire
// CRITICAL : Doit impérativement être placé AVANT app.use(express.json())
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

    try {
      await executerComptabiliteAutomatique({
        customerName: session.customer_details.name || "Client Stripe",
        customerPhone: session.customer_details.phone || "Non renseigné",
        totalAmount: session.amount_total / 100, // Conversion centimes -> XOF
        gateway: 'stripe',
        gatewayId: session.id,
        items: cartItems
      });
    } catch (error) {
      console.error(`[ERREUR COMPTABILITÉ STRIPE] : ${error.message}`);
    }
  }
  res.json({ received: true });
});

// Appliquer les middlewares globaux APRÈS le webhook brut de Stripe
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------------
// 2. ROUTE : Création d'une session Stripe Checkout (Cartes Bancaires)
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
// 3. ROUTE : Création d'un lien Mobile Money FedaPay (Orange, MTN, Moov, Wave)
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
    
    const formattedItems = cart.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price
    }));

    // Création de la transaction en attente dans Firestore
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
// 4. WEBHOOK FEDAPAY : Écoute et SÉCURISE les confirmations Mobile Money
// -------------------------------------------------------------------------
app.post('/webhook-fedapay', async (req, res) => {
  const sig = req.headers['x-fedapay-signature'];
  let event;

  try {
    event = Webhook.constructEvent(JSON.stringify(req.body), sig, process.env.FEDAPAY_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`[ERREUR WEBHOOK FEDAPAY] Signature invalide : ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.name === 'transaction.approved') {
    const transactionData = event.entity;
    const fedaTxId = transactionData.id;
    const transactionDocRef = db.collection('transactions').doc(`feda_${fedaTxId}`);
    
    try {
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
    } catch (error) {
      console.error(`[ERREUR TRAITEMENT FEDAPAY] : ${error.message}`);
    }
  }
  res.status(200).send('Webhook FedaPay Traité');
});

// -------------------------------------------------------------------------
// 5. FONCTION INTERNE : Automatisation Comptable & Déduction des Stocks NoMar
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
    if (item.id) { 
      const productRef = db.collection('products').doc(item.id);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.quantity)
      });
    }
  });

  await batch.commit();
  console.log(`[AUTOMATISATION NOMAR] Stock mis à jour et CA incrémenté (+${data.totalAmount} XOF) pour : ${currentMonth}`);
}

// -------------------------------------------------------------------------
// 6. ROUTE DE DIAGNOSTIC FIRESTORE
// -------------------------------------------------------------------------
app.get('/test-firebase', async (req, res) => {
  try {
    const testRef = db.collection('test').doc('statut');
    await testRef.set({ connexion: "Réussie", date: new Date().toISOString() });
    
    const doc = await testRef.get();
    res.status(200).json({ message: "Firebase est bien connecté !", data: doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Écoute sur 0.0.0.0 pour permettre le port binding de Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur NM-Shop (NoMar) lancé avec succès sur le port ${PORT}`);
});