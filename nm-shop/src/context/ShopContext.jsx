import React, { createContext, useState, useContext } from 'react';

// Création du contexte
const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Liste de produits par défaut (en attendant Firebase)
  const [products] = useState([
    { 
      id: 1, 
      name: "Tracteur John Deere miniature", 
      price: 1500000, 
      category: "Matériel",
      imageUrl: "https://images.unsplash.com/photo-1594495894542-a4e17a73ac94?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 2, 
      name: "Engrais Bio 10kg", 
      price: 35000, 
      category: "Soin",
      imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 3, 
      name: "Semences de Blé (Sac)", 
      price: 50000, 
      category: "Semences",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400" 
    }
  ]);

  const [cart, setCart] = useState([]);

  // Fonction pour ajouter au panier
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
    console.log("Produit ajouté !", product.name);
  };

  return (
    <ShopContext.Provider value={{ products, cart, addToCart }}>
      {children}
    </ShopContext.Provider>
  );
};

// Petit hook personnalisé pour utiliser le shop plus vite
export const useShop = () => useContext(ShopContext);