import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  const { setCart } = useShop();

  useEffect(() => {
    // On vide le panier local uniquement lorsque la commande est validée avec succès
    if (typeof setCart === 'function') {
      setCart([]);
    } else {
      // Si setCart n'est pas exposé directement, ajoute une fonction clearCart() dans ton ShopContext
      localStorage.removeItem('cart'); // Optionnel si tu stockes une copie dans le localStorage
    }
  }, [setCart]);

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white border border-slate-100 rounded-2xl shadow-xl text-center text-slate-800">
      <div className="flex justify-center mb-4">
        <CheckCircle size={64} className="text-[#007A00]" />
      </div>
      
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Paiement Réussi !</h1>
      <p className="text-sm text-slate-500 mb-6">
        Merci pour votre achat chez <strong>NoMar</strong>. Votre commande a bien été enregistrée.
      </p>

      <div className="bg-slate-50 p-4 rounded-xl text-left space-y-3 mb-6 border border-slate-100">
        <div className="flex items-start gap-3">
          <Truck className="text-[#007A00] shrink-0 mt-0.5" size={18} />
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400">Prochaine étape :</h3>
            <p className="text-sm font-medium text-slate-600">
              Notre service logistique va vous contacter par téléphone pour planifier la livraison à votre domicile.
            </p>
          </div>
        </div>
      </div>

      <Link 
        to="/" 
        className="inline-flex items-center justify-center gap-2 w-full bg-brand-dark hover:bg-[#007A00] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md"
      >
        <ShoppingBag size={16} />
        Retour à la boutique
      </Link>
    </div>
  );
};

export default SuccessPage;