import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';

// Création du contexte
const ShopContext = createContext();

// URL de ton backend Node.js (modifiée pour l'objet de configuration Vite)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // -------------------------------------------------------------------------
  // LIAISON FIRESTORE EN TEMPS RÉEL
  // -------------------------------------------------------------------------
  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsList = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Sécurité : Éviter de modifier directement l'objet figé de Firestore
        const updatedData = { ...data };
        
        if (updatedData.weight === 22.5 && !updatedData.stripeProductId) {
          updatedData.stripeProductId = "prod_UdvB3uq1YZh3YN";
        }

        return {
          id: doc.id, 
          ...updatedData
        };
      });
      
      setProducts(productsList);
      setLoading(false);
    }, (error) => {
      console.error("❌ Erreur de récupération Firestore :", error);
      setLoading(false);
    });

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

  // -------------------------------------------------------------------------
  // 5. LOGIQUE DE PAIEMENT EXPRESS SANS COMPTE (Stripe & FedaPay)
  // -------------------------------------------------------------------------
  const handleCheckout = async (gateway, customerDetails) => {
    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    if (!customerDetails?.lastName || !customerDetails?.firstName || !customerDetails?.phone || !customerDetails?.email || !customerDetails?.cityArea) {
      alert("Veuillez remplir tous les champs obligatoires du formulaire de livraison.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const totalAmount = getCartTotal();

      const payload = {
        cart: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customer: {
          name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: `${customerDetails.cityArea} - ${customerDetails.addressDetails || 'Aucune précision fournie'}`
        },
        amount: totalAmount
      };

      const response = await fetch(`${API_BASE_URL}/api/payment/${gateway}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'initialisation du paiement.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("L'URL de redirection est manquante.");
      }

    } catch (error) {
      console.error(`[ERREUR DE PAIEMENT - ${gateway.toUpperCase()}] :`, error.message);
      alert(`Impossible d'initier le paiement : ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <ShopContext.Provider value={{ 
      products, 
      cart, 
      loading,
      isProcessingPayment,
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      getCartTotal, 
      handleCheckout 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook personnalisé
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop doit être utilisé à l'intérieur d'un ShopProvider");
  }
  return context;
};