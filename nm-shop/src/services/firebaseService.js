import { db } from '../firebase/config'; // Ton fichier de config Firebase initialisé
import { collection, getDocs, doc, setDoc, query, where, increment, updateDoc } from 'firebase/firestore';

// 1. Récupérer tous les produits du catalogue NoMar
export const getCatalog = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur récupération catalogue:", error);
    throw error;
  }
};

// 2. Enregistrer une transaction réussie et mettre à jour le Chiffre d'Affaires Mensuel
export const saveTransactionAndAggregates = async (transactionData) => {
  try {
    const currentMonth = transactionData.monthYear; // Ex: "06-2026"
    
    // Enregistrement de la transaction dans l'historique
    const transactionRef = doc(collection(db, "transactions"));
    await setDoc(transactionRef, transactionData);

    // Mise à jour ou création automatique du Chiffre d'Affaire du mois (Agrégation)
    const analyticsRef = doc(db, "analytics", currentMonth);
    await setDoc(analyticsRef, {
      monthYear: currentMonth,
      totalRevenue: increment(transactionData.totalAmount),
      ordersCount: increment(1),
      lastUpdated: new Date()
    }, { merge: true });

    console.log("Comptabilité mensuelle NoMar mise à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement comptable :", error);
  }
};