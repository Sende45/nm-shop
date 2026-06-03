import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useShop();

  // Écran d'état vide (Empty State) ultra-pro
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white">
        <div className="bg-brand-light p-6 rounded-3xl mb-6 shadow-2xs border border-emerald-100/20 animate-scale-up">
          <ShoppingBag size={48} className="text-brand-primary" />
        </div>
        <h2 className="text-2xl font-black text-brand-dark mb-2 tracking-tight">Votre panier est vide</h2>
        <p className="text-slate-400 mb-8 text-center max-w-sm text-sm font-medium leading-relaxed">
          Il semble que vous n'ayez pas encore ajouté de sacs de riz à votre commande actuelle.
        </p>
        <Link 
          to="/" 
          className="group bg-brand-primary hover:opacity-90 text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-950/10 text-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  // Formateur de prix pour afficher proprement en CFA (sans décimales)
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' CFA';
  };

  return (
    <div className="bg-slate-50/60 min-h-screen py-16 selection:bg-brand-primary selection:text-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* En-tête de page sémantique */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-8 bg-brand-primary rounded-full" />
          <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">Mon Panier</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* LISTE DES ARTICLES */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-100/80 flex items-center gap-4 sm:gap-6 transition-all duration-300 hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/40"
              >
                {/* Image du sac de riz avec un conteneur fixe isolé */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200"} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                  />
                </div>
                
                {/* Détails du produit */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-brand-dark text-base sm:text-lg group-hover:text-brand-primary transition-colors duration-200 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    {item.category || "Riz Premium"}
                  </p>
                  <p className="text-brand-primary font-black mt-1 text-base sm:text-lg">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Sélecteur de quantité premium */}
                <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100/80 shrink-0">
                  <button 
                    onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)} 
                    className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg transition-all cursor-pointer"
                    title="Diminuer"
                  >
                    <Minus size={13} strokeWidth={2.5} />
                  </button>
                  
                  <span className="font-black w-6 text-center text-brand-dark text-sm select-none">
                    {item.quantity}
                  </span>
                  
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                    className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg transition-all cursor-pointer"
                    title="Augmenter"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Bouton de suppression */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                  title="Supprimer l'article"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* RÉSUMÉ DE LA COMMANDE (STICKY VISUEL) */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100/80 h-fit lg:sticky lg:top-28 relative overflow-hidden">
            <h2 className="text-xl font-black text-brand-dark mb-6 tracking-tight">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400 text-sm font-semibold">
                <span>Sous-total</span>
                <span className="text-brand-dark font-bold">{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="flex justify-between text-slate-400 text-sm font-semibold items-center">
                <span>Livraison</span>
                <span className="text-brand-primary font-black bg-brand-light border border-emerald-100/50 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-2xs">
                  Gratuite
                </span>
              </div>
              
              <div className="border-t border-slate-100 pt-5 mt-2 flex justify-between text-xl font-black text-brand-dark tracking-tight">
                <span>Total</span>
                <span className="text-brand-primary font-black">{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            {/* Bouton d'action principal Call-to-action */}
            <button className="group/btn w-full bg-brand-dark hover:bg-brand-primary text-white py-4 rounded-2xl font-black transition-all duration-300 shadow-md shadow-emerald-950/5 flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider hover:-translate-y-0.5">
              Passer la commande 
              <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
            
            {/* Rassurance paiement bas de page */}
            <p className="text-center text-[11px] text-slate-400 mt-6 flex items-center justify-center gap-2 font-medium leading-relaxed">
              <CreditCard size={13} className="text-brand-gold shrink-0" /> 
              <span>Paiement sécurisé <span className="text-brand-dark font-semibold">à la livraison</span> ou par <span className="text-brand-dark font-semibold">Mobile Money</span></span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;