import React from 'react';
import { Leaf, Tractor, Sprout, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

const Home = () => {
  const { products, addToCart } = useShop();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-100 selection:text-green-900">
      
      {/* 1. HERO SECTION */}
      <Header />

      {/* 2. REASSURANCE BAR (Nouveau : pour le côté Pro) */}
      <div className="bg-white border-b border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-around">
          {[
            { icon: <Truck size={20}/>, text: "Livraison Rapide en 48h" },
            { icon: <ShieldCheck size={20}/>, text: "Paiement 100% Sécurisé" },
            { icon: <Leaf size={20}/>, text: "Produits Certifiés Qualité" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
              <span className="text-green-600 bg-green-50 p-2 rounded-full">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* 3. CATEGORIES (Univers) */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Nos Univers</h2>
          <div className="w-20 h-1.5 bg-green-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Matériel & Outillage", icon: <Tractor size={48} />, desc: "Tracteurs, charrues et outils de précision.", color: "bg-blue-50 text-blue-600" },
            { title: "Semences & Plants", icon: <Sprout size={48} />, desc: "Graines certifiées haute performance.", color: "bg-green-50 text-green-600" },
            { title: "Soin des cultures", icon: <Leaf size={48} />, desc: "Nutrition végétale et bio-protection.", color: "bg-emerald-50 text-emerald-600" },
          ].map((cat, i) => (
            <div key={i} className="group bg-white p-10 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-300 border border-slate-50 text-center cursor-pointer relative overflow-hidden">
              <div className={`inline-flex p-5 rounded-2xl mb-6 transition-transform group-hover:scale-110 duration-300 ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{cat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{cat.desc}</p>
              <div className="mt-6 flex justify-center text-green-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explorer <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUITS DYNAMIQUES */}
      <section className="py-24 bg-white px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">Articles Populaires</h2>
              <p className="text-slate-500 text-lg">Le matériel plébiscité par nos agriculteurs partenaires.</p>
            </div>
            <button className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all">
              Toute la boutique <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-slate-300 mb-4 flex justify-center"><Sprout size={64}/></div>
              <p className="text-slate-500 text-xl italic font-medium">
                La récolte est en cours... Aucun produit pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;