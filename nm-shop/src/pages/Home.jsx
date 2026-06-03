import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Star, ArrowRight, Layers, Award, Flame, ArrowUpRight } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

const Home = () => {
  const { products, addToCart } = useShop();
  const navigate = useNavigate();
  
  // LOGIQUE SÉMANTIQUE : On filtre pour s'assurer de ne garder que le riz NoMar
  const riceProducts = products?.filter(prod => {
    const name = prod.name?.toLowerCase() || '';
    const category = prod.category?.toLowerCase() || '';
    return (name.includes('riz') || category.includes('riz') || category.includes('brisure')) && !name.includes('blé');
  }) || [];
  
  // Récupération des 4 premiers produits pour la vitrine d'accueil
  const featuredProducts = riceProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-white font-['Gitaluevo'] antialiased selection:bg-[#1A6D00] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <Header />

      {/* 2. BARRE DE RASSURANCE FLOTTANTE */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 -mt-12 hidden md:block">
        <div className="bg-white rounded-3xl p-8 flex justify-around items-center border border-slate-100/80 shadow-[0_25px_60px_-15px_rgba(26,109,0,0.06)] backdrop-blur-md">
          {[
            { icon: <Truck size={22}/>, title: "Livraison Logistique", desc: "Abidjan 24h & Intérieur", colors: "text-[#1A6D00] bg-[#AFD13F]/10" },
            { icon: <ShieldCheck size={22}/>, title: "Transactions Sécurisées", desc: "À la livraison ou Mobile Money", colors: "text-[#F5C000] bg-amber-50" },
            { icon: <Award size={22}/>, title: "Normes & Qualité", desc: "Riz sélectionné grain par grain", colors: "text-[#1A6D00] bg-[#AFD13F]/10" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <span className={`p-3.5 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${item.colors}`}>
                {item.icon}
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. BENTO GRID - CATEGORIES NOMAR */}
      <section className="py-28 max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#1A6D00] font-black text-[10px] uppercase tracking-[0.25em] bg-[#AFD13F]/15 px-3 py-1.5 rounded-md mb-4 shadow-2xs">
            Sélection Nationale
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight max-w-2xl leading-[1.1]">
            Explorez nos univers de dégustation
          </h2>
          <div className="w-12 h-1 bg-[#F5C000] mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1 : Grand Format NoMar */}
          <div id="formats" className="lg:col-span-2 group bg-slate-950 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[380px] transition-all duration-300 hover:shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,109,0,0.15),transparent_55%)] transition-opacity duration-500 group-hover:opacity-80" />
            <div className="relative z-10 max-w-md">
              {/* CORRECTION : Couleur du badge unifiée sur ton Jaune Or F5C000 avec fond opacifié */}
              <span className="text-[9px] font-black tracking-widest text-[#F5C000] bg-[#F5C000]/10 px-3 py-1 rounded-md uppercase border border-[#F5C000]/20 backdrop-blur-xs">
                Rendement Familial
              </span>
              <h3 className="text-3xl md:text-4xl font-black mt-8 mb-4 leading-tight tracking-tight">Sacs Économiques<br />(25kg - 50kg)</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium opacity-90">
                Des formats professionnels et familiaux de maison **NoMar** pensés pour nourrir toute la maisonnée au meilleur tarif de Côte d'Ivoire.
              </p>
            </div>
            <div 
              onClick={() => navigate('/catalogue')}
              className="relative z-10 mt-8 flex items-center gap-3 text-[#F5C000] hover:text-white transition-colors duration-200 font-black text-xs uppercase tracking-wider cursor-pointer group/btn w-fit"
            >
              Découvrir la gamme Grossistes 
              <span className="p-2 bg-white/5 rounded-full border border-white/10 group-hover/btn:bg-[#F5C000] group-hover/btn:text-slate-900 group-hover/btn:border-[#F5C000] transition-all duration-300 group-hover/btn:rotate-45">
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>

          {/* Card 2 : Riz Parfumé */}
          <div onClick={() => navigate('/catalogue')} className="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#AFD13F]/10 rounded-bl-[6rem] transition-all duration-500 group-hover:scale-110 -z-10" />
            <div className="relative z-10">
              <span className="text-[#F5C000] bg-amber-50 p-4 rounded-2xl inline-flex items-center justify-center mb-8 border border-amber-100/50 shadow-2xs transition-transform duration-300 group-hover:scale-105">
                <Star size={24} className="fill-[#F5C000]" />
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Parfumé Premium</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                L'excellence du riz Jasmin importé, poli à la perfection pour sublimer toutes vos grandes réceptions familiales.
              </p>
            </div>
            <div className="mt-12 flex items-center justify-between text-slate-900 font-black text-xs uppercase tracking-wider pt-4 border-t border-slate-100">
              <span className="group-hover:text-[#1A6D00] transition-colors">Explorer la gamme</span>
              <ArrowRight size={16} className="text-[#1A6D00] group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3 : Riz Local & Brisures */}
          <div onClick={() => navigate('/catalogue')} className="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-50/40 rounded-bl-[6rem] transition-all duration-500 group-hover:scale-110 -z-10" />
            <div>
              <span className="text-[#1A6D00] bg-[#AFD13F]/10 p-4 rounded-2xl inline-flex items-center justify-center mb-8 border border-emerald-100/50 shadow-2xs transition-transform duration-300 group-hover:scale-105">
                <Layers size={24} />
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Terroir Local & Brisure</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                Le meilleur des récoltes de nos régions (Man, Gagnoa) et brisures fines de premier choix sélectionnées par NoMar.
              </p>
            </div>
            <div className="mt-12 flex items-center justify-between text-slate-900 font-black text-xs uppercase tracking-wider pt-4 border-t border-slate-100">
              <span className="group-hover:text-[#1A6D00] transition-colors">Soutenir le Terroir</span>
              <ArrowRight size={16} className="text-[#1A6D00] group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 4 : Statistiques Confiance */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1A6D00] to-[#AFD13F] rounded-[2.5rem] p-10 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-2 max-w-sm text-center md:text-left">
              <h4 className="text-2xl font-black tracking-tight">Le riz préféré des foyers abidjanais</h4>
              <p className="text-white/90 text-xs font-medium leading-relaxed">
                Nous collaborons main dans la main en circuit court pour vous éviter les intermédiaires et garantir les meilleurs prix du marché.
              </p>
            </div>
            <div className="flex gap-8 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-10 shrink-0 w-full md:w-auto justify-around">
              <div className="text-center md:text-left">
                <span className="block text-4xl md:text-5xl font-black tracking-tight text-[#F5C000]">98%</span>
                <span className="text-[10px] text-white/80 font-black uppercase tracking-wider mt-1.5 block">Avis Positifs</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-4xl md:text-5xl font-black tracking-tight text-[#F5C000]">+50k</span>
                <span className="text-[10px] text-white/80 font-black uppercase tracking-wider mt-1.5 block">Sacs Livrés</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ARTICLES LES PLUS DEMANDÉS (VITRINE ÉLITE) */}
      <section id="promotions" className="py-28 bg-gradient-to-b from-[#AFD13F]/5 to-slate-50/50 px-4 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-slate-100/60 pointer-events-none" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-slate-100/60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
            <div className="space-y-4 text-center md:text-left mx-auto md:mx-0 max-w-lg">
              <div className="inline-flex items-center gap-2 text-[10px] font-black text-[#1A6D00] uppercase tracking-[0.2em] bg-[#AFD13F]/15 px-3.5 py-1.5 rounded-lg shadow-2xs border border-emerald-100/40">
                <Flame size={12} className="animate-pulse text-[#F5C000] fill-[#F5C000]" /> 
                Demande Élevée
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Les incontournables de la semaine
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                Retrouvez les variétés de riz plébiscitées par nos clients à Abidjan pour leur tenue à la cuisson et leur parfum unique.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/catalogue')}
              className="group/btn flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-[#1A6D00] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer shrink-0 text-xs uppercase tracking-widest w-full sm:w-auto justify-center"
            >
              Découvrir tout le catalogue 
              <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Affichage dynamique : Squelettes de chargement vs Vrais Produits */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-scale-up">
              {featuredProducts.map((prod) => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          ) : (
            /* SQUELETTE DE CHARGEMENT PROFESSIONNEL */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-5 shadow-2xs animate-pulse">
                  <div className="h-48 bg-slate-100 rounded-xl w-full" />
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-full w-full" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-1 w-1/3">
                      <div className="h-2 bg-slate-100 rounded-full w-1/2" />
                      <div className="h-4 bg-slate-200 rounded-full w-full" />
                    </div>
                    <div className="h-10 w-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </section>

    </div>
  );
};

export default Home;