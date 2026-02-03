import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative h-[550px] md:h-[650px] flex items-center justify-center text-white bg-slate-950 overflow-hidden">
      {/* Overlay dégradé pour un texte parfaitement lisible */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-slate-950/90" />
      
      {/* Image de fond avec zoom léger au survol */}
      <img 
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-700 hover:scale-100"
        alt="Champs agricoles NM-Shop"
      />
      
      <div className="relative z-20 text-center px-6 max-w-5xl">
        {/* Badge de nouveauté */}
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
          <Leaf size={14} /> Nouveau Catalogue 2026
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tighter">
          LA TERRE, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            CHEZ VOUS.
          </span>
        </h1>

        <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto text-slate-300 font-light leading-relaxed">
          Équipez-vous avec le <span className="text-white font-medium">meilleur matériel</span> agricole et des semences sélectionnées pour leur résistance exceptionnelle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-green-900/20 flex items-center gap-3 text-lg">
            Découvrir les produits 
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-xl font-bold transition-all backdrop-blur-md">
            Nos conseils d'experts
          </button>
        </div>
      </div>

      {/* Petit indicateur de défilement en bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50">
        <div className="w-1 h-10 border-r border-white/30" />
      </div>
    </header>
  );
};

export default Header;