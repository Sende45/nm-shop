import React from 'react';
import { ShoppingCart, Star, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image du produit avec superposition d'actions */}
      <div className="h-64 overflow-hidden relative">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge Catégorie Stylisé */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm border border-slate-100">
          {product.category || "Agriculture"}
        </div>

        {/* Bouton Voir Rapide (Apparaît au survol) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
           <button className="p-3 bg-white text-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0">
             <Eye size={18} />
           </button>
        </div>
      </div>

      {/* Infos du produit */}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
          ))}
          <span className="text-[10px] text-slate-400 ml-1">(12 avis)</span>
        </div>

        <h3 className="text-md font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs text-slate-500 mb-4 line-clamp-1">
          {product.description || "Qualité supérieure certifiée NM-Shop."}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 line-through">{(product.price * 1.2).toFixed(2)}€</span>
            <span className="text-xl font-black text-slate-900">{product.price}CFA</span>
          </div>
          
          <button 
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center h-10 w-10 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-lg shadow-slate-200"
            title="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;