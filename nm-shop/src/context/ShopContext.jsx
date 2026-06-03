import React, { createContext, useState, useContext } from 'react';

// Création du contexte
const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // LISTE DE PRODUITS EXTENSIBLE & PREMIUM - IDENTITY OFFICIAL NOMAR
  const [products] = useState([
    { 
      id: 1, 
      name: "Riz Jasmin Parfumé Luxe (Mémé Extra) - 25KG", 
      price: 18500, 
      category: "Riz Parfumé",
      weight: 25, // 👈 Poids pour le panneau de filtres dynamique
      description: "Grain long poli, parfum naturel intense à la cuisson. Idéal pour vos repas de fête et grandes réceptions à Abidjan.",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600" 
    },
    { 
      id: 2, 
      name: "Brisure Premium 1er Choix (Oiseau de Paradis) - 22.5KG", 
      price: 14000, 
      category: "Local & Brisure",
      weight: 22.5, // 👈 Poids exact demandé
      description: "Brisures fines sélectionnées grain par grain, parfaites pour réussir un Tchep ou un Riz au gras d'exception.",
      imageUrl: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=600" 
    },
    { 
      id: 3, 
      name: "Riz Local Riziculteurs de Man - 10KG", 
      price: 6500, 
      category: "Terroir Local",
      weight: 10, // 👈 Poids exact demandé
      description: "Riz de terroir 100% ivoirien, riche en nutriments et cultivé de manière écoresponsable à Man.",
      imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=600" 
    },
    { 
      id: 4, 
      name: "Riz Parfumé Royal Élite - 5KG", 
      price: 3800, 
      category: "Riz Parfumé",
      weight: 5, // 👈 Poids exact demandé
      description: "Format pratique et compact, idéal pour les jeunes foyers ou pour tester la qualité supérieure NoMar.",
      imageUrl: "https://images.unsplash.com/photo-1590005354167-6da97870c913?q=80&w=600" 
    },
    { 
      id: 5, 
      name: "Format Familial Éco Giga Sac - 50KG", 
      price: 29000, 
      category: "Gros Formats",
      weight: 50, // 👈 Poids exact demandé
      description: "Le meilleur rendement économique pour nourrir toute la maisonnée au meilleur tarif de Côte d'Ivoire.",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600" 
    }
  ]);

  const [cart, setCart] = useState([]);

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
    <ShopContext.Provider value={{ products, cart, addToCart, updateQuantity, removeFromCart, getCartTotal }}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook personnalisé de confiance
export const useShop = () => useContext(ShopContext);