import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Ajouté
import { getStorage } from "firebase/storage";    // Ajouté

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

// EXPORTS : C'est ce qui permet à Admin.jsx de fonctionner
export const db = getFirestore(app);
export const storage = getStorage(app);