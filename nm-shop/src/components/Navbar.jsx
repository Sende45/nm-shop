import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effet de scroll pour changer l'apparence au défilement
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/90 backdrop-blur-md py-4'
    } border-b border-slate-100`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* LOGO avec Animation */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter hidden sm:block">
            NM<span className="text-indigo-600">-SHOP</span>
          </span>
        </Link>

        {/* NAVIGATION CENTRALE (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          {['Nouveautés', 'Terroir', 'Promotions', 'Expertise'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} 
               className="relative text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>
        
        {/* ACTIONS & RECHERCHE */}
        <div className="flex items-center gap-2 sm:gap-6 text-slate-700">
          
          {/* Barre de recherche discrète mais efficace */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Rechercher..." className="bg-transparent border-none focus:ring-0 text-sm w-32 xl:w-48 ml-2" />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group">
              <User size={22} className="group-hover:text-indigo-600" />
            </button>

            <Link to="/panier" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group">
              <ShoppingBag size={22} className="group-hover:text-indigo-600" />
              <span className="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                0
              </span>
            </Link>

            {/* BOUTON MENU MOBILE */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-full">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE (Apparaît au clic) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 animate-in slide-in-from-top p-6 flex flex-col gap-4">
          <input type="text" placeholder="Rechercher un produit..." className="w-full bg-slate-100 rounded-xl p-3 outline-none" />
          <div className="flex flex-col gap-4 font-bold text-slate-800">
            <a href="#">Nouveautés</a>
            <a href="#">Terroir</a>
            <a href="#">Promotions</a>
            <hr />
            <Link to="/admin" className="text-indigo-600">Espace Admin</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;