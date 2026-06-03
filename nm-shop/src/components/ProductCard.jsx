import React from 'react';
import { ShoppingCart, Star, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  
  // Formateur localisé pour un affichage propre des prix en CFA sans décimales
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' CFA';
  };

  // IMAGE DE RECOURS : Un magnifique sac de riz premium si le lien de la DB est mort ou vide
  const defaultRiceImage = "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600";

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between selection:bg-brand-primary selection:text-white">
      
      {/* 1. IMAGE DU PRODUIT + ACTIONS AU SURVOL */}
      <div className="h-60 overflow-hidden relative bg-slate-50 border-b border-slate-100/50">
        <img 
          src={product.imageUrl && product.imageUrl.trim() !== "" ? product.imageUrl : defaultRiceImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            // Sécurité absolue : si l'URL existe mais renvoie une erreur 404, on bascule sur le fallback
            e.target.src = defaultRiceImage;
          }}
        />
        
        {/* Badge Catégorie Dynamique */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-dark text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-2xs border border-slate-100/60">
          {product.category || "Riz Premium"}
        </div>

        {/* Bouton "Aperçu Rapide" */}
        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-3xs">
           <button className="p-3 bg-white text-brand-dark rounded-full hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-lg translate-y-3 group-hover:translate-y-0 cursor-pointer">
             <Eye size={16} />
           </button>
        </div>
      </div>

      {/* 2. CONTENU & INFORMATIONS PRODUIT */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Note globale (Étoiles couleur Or) */}
          <div className="flex items-center gap-0.5 mb-2.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-brand-gold text-brand-gold" />
            ))}
            <span className="text-[10px] text-slate-400 font-bold ml-1.5 tracking-tight">(24 avis)</span>
          </div>

          {/* Nom du produit */}
          <h3 className="text-base font-black text-brand-dark mb-1 group-hover:text-brand-primary transition-colors duration-200 line-clamp-1 tracking-tight uppercase">
            {product.name}
          </h3>
          
          {/* Description textuelle courte */}
          <p className="text-xs text-slate-400 mb-5 line-clamp-2 leading-relaxed font-medium">
            {product.description || "Sélection rigoureuse pour une cuisson parfaite et un goût authentique."}
          </p>
        </div>

        {/* 3. SECTION PRIX & BOUTON PANIER */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            {/* Prix d'origine barré */}
            <span className="text-[11px] text-slate-400 line-through font-semibold tracking-tight">
              {formatPrice(Math.round(product.price * 1.15))}
            </span>
            {/* Prix actuel en vigueur */}
            <span className="text-lg font-black text-brand-dark tracking-tighter">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {/* Bouton d'ajout au panier */}
          <button 
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center h-10 w-10 bg-brand-dark hover:bg-brand-primary text-white rounded-xl transition-all duration-300 shadow-md shadow-emerald-950/5 cursor-pointer hover:scale-105 active:scale-95 group-hover:shadow-lg"
            title="Ajouter au panier"
          >
            <ShoppingCart size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;