import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [activeOverlay, setActiveOverlay] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeOverlay]);

  return (
    <header 
      data-overlay-active={activeOverlay ? "true" : "false"}
      className="group relative h-[520px] md:h-[650px] flex items-center justify-center text-white bg-slate-950 overflow-hidden selection:bg-[#007A00] selection:text-white"
    >
      {/* Masque de contraste pro pour que le texte blanc reste lisible */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/65 via-black/35 to-slate-950" />
      
      {/* TON IMAGE FINALE NOMAR DEPUIS LE CDN IMGBB */}
      <img 
        src="https://i.ibb.co/27Qd5g94/nomar.jpg" 
        className="absolute inset-0 w-full h-full object-cover opacity-50 scale-102 transition-transform duration-1000 group-hover:scale-100"
        alt="Plantage de riz premium NoMar"
        onError={(e) => {
          // Secours visuel de secours au cas où le réseau CDN sauterait temporairement
          e.target.src = "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=1600";
        }}
      />
      
      {/* CONTENU CENTRALISÉ */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6">
        
        {/* Badge indicatif */}
        <div className="inline-flex items-center gap-2 bg-[#007A00]/20 border border-[#007A00]/30 text-[#007A00] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-md shadow-emerald-950/20">
          <ShoppingBag size={13} className="text-[#D4A373]" /> Stock Frais NoMar Disponible
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight uppercase">
          LE MEILLEUR RIZ, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A373] via-emerald-400 to-emerald-100">
            CHEZ VOUS.
          </span>
        </h1>

        <p className="text-sm md:text-base max-w-2xl mx-auto text-slate-300 font-medium leading-relaxed opacity-95">
          Découvrez l'excellence culinaire de la maison **NoMar**. Du riz parfumé de premier choix sélectionné grain par grain. Commandez en quelques instants et profitez d'une livraison à domicile <span className="text-white font-bold border-b border-[#D4A373]/40 pb-0.5">à Abidjan et partout en Côte d'Ivoire</span>.
        </p>

        {/* Boutons d'action unifiés */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate('/catalogue')}
            className="group/btn w-full sm:w-auto bg-[#007A00] hover:bg-[#006400] text-white px-10 py-4 rounded-xl font-black transition-all duration-300 shadow-xl shadow-emerald-950/30 flex items-center justify-center gap-3 text-xs uppercase tracking-wider cursor-pointer transform hover:-translate-y-0.5"
          >
            Voir le catalogue 
            <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>
          
          <button 
            onClick={() => setActiveOverlay('shipping')}
            className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all duration-300 backdrop-blur-md cursor-pointer transform hover:-translate-y-0.5 text-xs uppercase tracking-wider"
          >
            Tarifs de Livraison
          </button>
        </div>
      </div>

      {/* OVERLAY LOGISTIQUE */}
      <div className={`fixed inset-0 z-[9999] bg-slate-950 flex flex-col transition-all duration-300 ease-in-out ${
        activeOverlay ? 'opacity-100 pointer-events-auto visible scale-100' : 'opacity-0 pointer-events-none invisible scale-98'
      }`}>
        <div className="w-full bg-slate-900/60 border-b border-slate-900/80 backdrop-blur-md">
          <div className="max-w-7xl w-full mx-auto px-6 py-5 flex justify-between items-center">
            <span className="text-xl font-black text-[#007A00] tracking-tight uppercase flex items-center">
              N<span className="inline-block w-3 h-4.5 border-2 border-[#007A00] rounded-full mx-0.5 rotate-6"></span>mar
            </span>
            <button onClick={() => setActiveOverlay(null)} className="group/close flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-12 max-w-4xl w-full mx-auto">
          {activeOverlay === 'shipping' && (
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <span className="text-[#D4A373] font-black text-xs uppercase tracking-widest bg-[#D4A373]/10 px-3 py-1 rounded-md">Logistique NoMar</span>
                <h2 className="text-4xl font-black text-white mt-2 mb-4 tracking-tight">Tarifs de Livraison</h2>
              </div>
              <div className="space-y-4 pt-4">
                {[
                  { zone: "Zone A : Cocody, Marcory, Biétry", time: "Livraison sous 24h", cost: "Gratuit dès 2 sacs" },
                  { zone: "Zone B : Yopougon, Abobo, Bingerville", time: "Livraison sous 24h à 48h", cost: "1 500 CFA / commande" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-[#007A00] shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="font-bold text-white">{item.zone}</h4>
                        <p className="text-slate-400 text-xs mt-0.5">{item.time}</p>
                      </div>
                    </div>
                    <span className="bg-slate-900 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs">
                      {item.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;