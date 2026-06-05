import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";    
import { getAuth } from "firebase/auth"; // 👈 1. AJOUT DE L'IMPORT DE L'AUTH

const firebaseConfig = {
  apiKey: "AIzaSyCa0sk3zC8ez5DbncBqoPBfVzwE5tFVzCw",
  authDomain: "nm-shop-9ca3c.firebaseapp.com",
  projectId: "nm-shop-9ca3c",
  storageBucket: "nm-shop-9ca3c.firebasestorage.app",
  messagingSenderId: "653599831949",
  appId: "1:653599831949:web:410c81cdebfcfa831d6fc4",
  measurementId: "G-K3GZ5ETFTR"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// EXPORTS : Accessibles dans tout ton projet NoMar
export const db = getFirestore(app);
export const storage = getStorage(app); 
export const auth = getAuth(app); // 👈 2. AJOUT DE L'EXPORT DE L'AUTH POUR ADMINLOGIN