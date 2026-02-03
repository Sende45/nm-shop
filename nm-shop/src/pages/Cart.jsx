import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <CreditCard size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Votre panier est vide</h2>
        <p className="text-slate-500 mb-8 text-center">Il semble que vous n'ayez pas encore ajouté de trésors de notre terroir.</p>
        <Link to="/" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2">
          <ArrowLeft size={20} /> Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-black text-slate-900 mb-10">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.category}</p>
                  <p className="text-green-600 font-bold mt-1">{item.price}CFA</p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-green-600"><Minus size={16} /></button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-green-600"><Plus size={16} /></button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Résumé</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livraison</span>
                <span className="text-green-600 font-medium">Gratuite</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-xl font-black text-slate-900">
                <span>Total</span>
                <span>{getCartTotal().toFixed(2)}€</span>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
              Passer au paiement <ArrowLeft size={20} className="rotate-180" />
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-2">
              <CreditCard size={12} /> Paiement 100% sécurisé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;