import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error("❌ Erreur : La clé privée Firebase est introuvable ou mal configurée dans le fichier .env");
}

// Sécurité supplémentaire pour éviter un crash si initializeApp est appelé deux fois par Nodemon
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Remplace les chaînes "\n" textuelles par de vrais sauts de ligne pour OpenSSL
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
  console.log("✅ Connexion à Firebase Admin initialisée avec succès !");
}

const db = admin.firestore();
const auth = admin.auth();

// Exportation globale pour que index.js ait accès à db, auth ET aux FieldValue d'admin
export { admin, db, auth };