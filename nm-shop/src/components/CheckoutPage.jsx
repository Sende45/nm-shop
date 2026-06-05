import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CreditCard, Smartphone, MapPin, User, Mail, Phone, ShoppingBag, Banknote } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, getCartTotal, handleCheckout, isProcessingPayment } = useShop();

  // Liste des principales communes d'Abidjan pour faciliter la saisie rapide
  const communesAbidjan = [
    "Cocody", "Marcory", "Koumassi", "Yopougon", "Treichville", 
    "Adjame", "Abobo", "Plateau", "Port-Bouët", "Bingerville", "Songon"
  ];

  // 1. État pour suivre le mode de paiement sélectionné (Défaut : Mobile Money)
  const [paymentMethod, setPaymentMethod] = useState('fedapay');

  // État local du formulaire de livraison
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    cityArea: '', // Commune d'Abidjan
    addressDetails: '' // Précisions : Carrefour, point de repère...
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Formateur de prix CFA
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' CFA';
  };

  // Gestion de la validation finale de la commande
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Envoie la méthode sélectionnée ('fedapay', 'stripe', ou 'cod') et les infos clients au contexte
    handleCheckout(paymentMethod, formData);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
        <ShoppingBag size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-800">Votre panier est vide</h2>
        <p className="text-slate-400 text-sm mt-1">Ajoutez des sacs de riz premium pour pouvoir commander.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-800">
      
      {/* SECTION GAUCHE : FORMULAIRE DE LIVRAISON & SÉLECTION DU PAIEMENT */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* BLOC 1 : FORMULAIRE D'ADRESSE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
            <MapPin className="text-[#007A00]" size={20} />
            Informations de Livraison <span className="text-xs text-slate-400 font-medium font-sans normal-case">(Sans création de compte)</span>
          </h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Nom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Ex: Kouadio" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Prénom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ex: Konan" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Numéro de Téléphone (Mobile Money) *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ex: 0707070707" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Adresse Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Ex: client@gmail.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Commune (Abidjan) *</label>
              <select required name="cityArea" value={formData.cityArea} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors appearance-none">
                <option value="">Sélectionnez votre commune...</option>
                {communesAbidjan.map((commune, index) => (
                  <option key={index} value={commune}>{commune}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Précisions sur le domicile / Point de repère</label>
              <textarea name="addressDetails" value={formData.addressDetails} onChange={handleInputChange} rows="3" placeholder="Ex: Angré Terminus 81-82, à côté de la pharmacie, Immeuble B, 2ème étage..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors resize-none"></textarea>
            </div>
          </form>
        </div>

        {/* BLOC 2 : CHOIX DU TYPE DE PAIEMENT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
            <Banknote className="text-[#007A00]" size={20} />
            Mode de paiement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Option 1 : FedaPay (Mobile Money) */}
            <div 
              onClick={() => setPaymentMethod('fedapay')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 select-none ${
                paymentMethod === 'fedapay' 
                  ? 'border-[#007A00] bg-emerald-50/30' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <Smartphone size={24} className={paymentMethod === 'fedapay' ? 'text-[#007A00]' : 'text-slate-400'} />
              <div>
                <p className="text-sm font-black">Mobile Money</p>
                <p className="text-[10px] text-slate-400 font-medium">Wave, Orange, MTN, Moov</p>
              </div>
            </div>

            {/* Option 2 : Stripe (Carte Bancaire) */}
            <div 
              onClick={() => setPaymentMethod('stripe')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 select-none ${
                paymentMethod === 'stripe' 
                  ? 'border-[#007A00] bg-emerald-50/30' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <CreditCard size={24} className={paymentMethod === 'stripe' ? 'text-[#007A00]' : 'text-slate-400'} />
              <div>
                <p className="text-sm font-black">Carte Bancaire</p>
                <p className="text-[10px] text-slate-400 font-medium">Visa, Mastercard</p>
              </div>
            </div>

            {/* Option 3 : Espèce (À la livraison) */}
            <div 
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 select-none ${
                paymentMethod === 'cod' 
                  ? 'border-[#007A00] bg-emerald-50/30' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <Banknote size={24} className={paymentMethod === 'cod' ? 'text-[#007A00]' : 'text-slate-400'} />
              <div>
                <p className="text-sm font-black">À la livraison</p>
                <p className="text-[10px] text-slate-400 font-medium">Espèce à Abidjan</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION DROITE : RÉCAPITULATIF DU PANIER & BOUTON UNIQUE */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-6">
          <h2 className="text-base font-black uppercase tracking-tight mb-4 border-b border-slate-200 pb-2">Résumé de la commande</h2>
          
          {/* Liste des articles */}
          <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                <span className="line-clamp-1 text-slate-600">
                  {item.name} <span className="text-xs text-[#007A00] font-bold">x{item.quantity}</span>
                </span>
                <span className="font-bold shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-between items-center mb-6">
            <span className="text-sm font-bold uppercase text-slate-500">Total à payer</span>
            <span className="text-xl font-black text-[#007A00]">{formatPrice(getCartTotal())}</span>
          </div>

          {/* BOUTON D'ACTION DYNAMIQUE UNIQUE */}
          <button
            onClick={handleSubmitOrder}
            disabled={isProcessingPayment}
            className="w-full bg-slate-900 hover:bg-[#007A00] disabled:bg-slate-300 text-white font-black py-4 px-4 rounded-xl text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessingPayment ? (
              "Traitement en cours..."
            ) : paymentMethod === 'cod' ? (
              <>
                <Banknote size={18} />
                Confirmer ma commande (Espèce)
              </>
            ) : paymentMethod === 'stripe' ? (
              <>
                <CreditCard size={18} />
                Passer au paiement par Carte
              </>
            ) : (
              <>
                <Smartphone size={18} />
                Passer au paiement Mobile Money
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 font-medium text-center mt-4 leading-relaxed">
            {paymentMethod === 'cod' 
              ? "Vous préparerez la somme exacte en espèces à remettre directement au livreur lors du dépôt de votre riz."
              : "Vos données de livraison servent uniquement à l'expédition. Vous serez redirigé vers une passerelle externe sécurisée."}
          </p>
        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;