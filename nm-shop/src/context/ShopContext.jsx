import React, { createContext, useState, useContext, useEffect } from 'react';
// Importation de ton instance Firebase configurée côté Frontend Vercel
import { db } from '../firebase/config'; 
import { collection, onSnapshot } from 'firebase/firestore';

// Création du contexte
const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------------------
  // LIAISON FIRESTORE EN TEMPS RÉEL
  // -------------------------------------------------------------------------
  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    // onSnapshot met à jour l'état dès que le stock ou le prix change dans Firestore
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsList = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Sécurité & Flexibilité : Si c'est le sac de 22.5 kg, on s'assure qu'il a son ID Stripe
        if (data.weight === 22.5 && !data.stripeProductId) {
          data.stripeProductId = "prod_UdvB3uq1YZh3YN";
        }

        return {
          id: doc.id, // Utilise l'ID du document Firestore
          ...data
        };
      });
      
      setProducts(productsList);
      setLoading(false);
    }, (error) => {
      console.error("❌ Erreur de récupération Firestore :", error);
      setLoading(false);
    });

    // Nettoyage de l'écouteur à la destruction du composant
    return () => unsubscribe();
  }, []);

  // 1. Fonction pour ajouter au panier
  const addToCart = (product) => {
    setCart((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 2. Fonction pour ajuster la quantité (+1 ou -1)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  // 3. Fonction pour supprimer définitivement un article du panier
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item.id !== productId));
  };

  // 4. Fonction pour calculer le montant total du panier en CFA
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <ShopContext.Provider value={{ products, cart, addToCart, updateQuantity, removeFromCart, getCartTotal, loading }}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook personnalisé de confiance
export const useShop = () => useContext(ShopContext);