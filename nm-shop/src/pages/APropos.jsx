import React from 'react';
import { Award, ShieldCheck, Leaf, Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const APropos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 selection:bg-[#007A00] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-20">
        
        {/* SECTION ENTÊTE / MANIFESTE */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black tracking-widest text-[#D4A373] uppercase bg-[#D4A373]/10 px-3 py-1 rounded-md">
            Maison Fondée pour le Terroir
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tight leading-tight">
            L'HISTOIRE DE <span className="text-[#007A00]">NOMAR</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
            Bien plus qu'une marque, une ambition nationale : redéfinir la distribution du riz en Côte d'Ivoire en connectant directement l'excellence des rizières aux foyers ivoiriens.
          </p>
        </div>

        {/* GRANDE BANNIÈRE IMMERSIVE */}
        <div className="h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden relative shadow-md border border-white">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover"
            alt="Rizières en Côte d'Ivoire"
          />
        </div>

        {/* NOTRE VISION / NOTRE ENGAGEMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-black text-brand-dark tracking-tight">
              Notre engagement pour la souveraineté alimentaire
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Chez NoMar, nous croyons fermement que chaque grain de riz servi à votre table doit raconter une histoire de passion, de rigueur et de soutien à nos braves riziculteurs. C'est pourquoi nous militons pour la promotion des cultures locales de nos régions (Man, Gagnoa) tout en sélectionnant les brisures et riz parfumés importés les plus prisés du marché.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Nous éliminons les intermédiaires spéculatifs superflus pour vous garantir des prix justes, stables et transparents tout au long de l'année.
            </p>
          </div>
          
          {/* GRILLE DES VALEURS PIVOTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Leaf size={20} />, title: "100% Rigoureux", desc: "Tri grain par grain pour une cuisson parfaite sans impuretés." },
              { icon: <Award size={20} />, title: "Qualité Supérieure", desc: "Des riz sélectionnés pour leur tenue et leur parfum unique." },
              { icon: <Users size={20} />, title: "Circuit Court", desc: "Soutien et collaboration directe avec les acteurs de la filière." },
              { icon: <ShieldCheck size={20} />, title: "Confiance Totale", desc: "Livraison sécurisée et paiement à la réception à Abidjan." }
            ].map((val, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                <span className="p-2.5 bg-[#007A00]/10 text-[#007A00] rounded-xl inline-block">
                  {val.icon}
                </span>
                <h4 className="font-black text-brand-dark text-sm tracking-tight">{val.title}</h4>
                <p className="text-slate-400 text-[11px] font-semibold leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION FOOTER APPEL À L'ACTION */}
        <div className="bg-brand-dark text-white p-10 md:p-14 rounded-[2.5rem] text-center space-y-6 relative overflow-hidden shadow-xl shadow-emerald-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />
          <h3 className="text-2xl md:text-3xl font-black tracking-tight max-w-xl mx-auto">
            Prêt à goûter la différence avec la sélection premium NoMar ?
          </h3>
          <button 
            onClick={() => navigate('/catalogue')}
            className="bg-[#007A00] hover:bg-[#006400] text-white font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Explorer le catalogue
          </button>
        </div>

      </div>
    </div>
  );
};

export default APropos;