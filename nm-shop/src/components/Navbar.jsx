import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Menu, X, Phone, BookOpen, Layers, ChevronDown, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const { cart, products } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour la recherche prédictive (Autocomplete)
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  const totalItems = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const categories = [...new Set(products?.map(p => p.category).filter(Boolean) || [])];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les menus et vider la recherche lors du changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setShowSuggestions(false);
    setSearchQuery('');
  }, [location]);

  // Logique d'affichage des suggestions à la volée (Filtrage local issu de Firestore)
  useEffect(() => {
    if (searchQuery.trim().length > 1 && products) {
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.weight?.toString().includes(searchQuery)
      ).slice(0, 5); // Limiter à 5 suggestions max pour le design
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  // Fermer les suggestions si on clique en dehors de la barre de recherche
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Exécution de la recherche globale
  const executeSearch = (queryText) => {
    const finalQuery = queryText || searchQuery;
    if (finalQuery.trim()) {
      setIsMobileMenuOpen(false);
      setShowSuggestions(false);
      navigate(`/catalogue?search=${encodeURIComponent(finalQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handleCategoryClick = (category) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/catalogue?category=${encodeURIComponent(category)}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
    } border-b border-slate-100/80 font-['Gitaluevo'] selection:bg-[#1A6D00] selection:text-white`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        
        {/* LOGO BOUTON */}
        <Link to="/" className="flex items-center group shrink-0 focus:outline-none" title="Accueil NoMar">
          <div className="h-12 md:h-14 flex items-center transition-transform duration-200 active:scale-95">
            <img 
              src="https://i.ibb.co/KxCBDR2R/logo-nomar.jpg" 
              alt="Logo NoMar" 
              className="h-full w-auto object-contain mix-blend-multiply"
              onError={(e) => {
                e.target.style.display = 'none';
                const container = e.target.parentNode;
                if (container && !container.querySelector('.fallback-logo')) {
                  const fallback = document.createElement('span');
                  fallback.className = 'fallback-logo text-2xl font-black text-[#1A6D00] tracking-tight uppercase';
                  fallback.innerText = 'NOMAR';
                  container.appendChild(fallback);
                }
              }}
            />
          </div>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="relative group/menu">
            <Link 
              to="/catalogue" 
              className={`relative text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-200 py-1 ${
                isActive('/catalogue') ? 'text-[#1A6D00]' : 'text-slate-500 hover:text-[#1A6D00]'
              }`}
              onMouseEnter={() => setIsDropdownOpen(true)}
            >
              <Layers size={14} />
              Catalogue
              <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Link>

            {isDropdownOpen && categories.length > 0 && (
              <div 
                className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-scale-up"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link to="/catalogue" className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1A6D00]">
                  Tous nos produits
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full text-left block px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1A6D00] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {[
            { name: 'Notre Histoire', path: '/a-propos', icon: <BookOpen size={14} /> },
            { name: 'Contactez-nous', path: '/contact', icon: <Phone size={14} /> }
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`relative text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-200 py-1 ${
                isActive(item.path) ? 'text-[#1A6D00]' : 'text-slate-500 hover:text-[#1A6D00]'
              }`}
            >
              {item.icon}
              {item.name}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#1A6D00] transition-all duration-200 ${
                isActive(item.path) ? 'w-full' : 'w-0'
              }`}></span>
            </Link>
          ))}
        </div>
        
        {/* BARRE DE RECHERCHE, BOUTON WHATSAPP & PANIER */}
        <div className="flex items-center gap-2 sm:gap-4 text-slate-700 flex-1 md:flex-none justify-end">
          
          {/* CONTENEUR DE RECHERCHE AVEC SUGGESTIONS DIRECTES */}
          <div ref={searchContainerRef} className="hidden md:block relative">
            <div className="flex items-center bg-slate-50/80 rounded-xl px-4 py-2 border border-slate-100/80 focus-within:border-[#1A6D00]/30 focus-within:bg-white focus-within:shadow-xs transition-all duration-200">
              <button 
                onClick={() => executeSearch()} 
                className="text-slate-400 hover:text-[#1A6D00] transition-colors focus:outline-none cursor-pointer"
                title="Lancer la recherche"
              >
                <Search size={15} />
              </button>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Rechercher un sac de riz..." 
                className="bg-transparent border-none outline-none focus:ring-0 text-xs w-44 xl:w-60 ml-2 text-brand-dark font-semibold placeholder-slate-400" 
              />
            </div>

            {/* Fenêtre déroulante prédictive (Autocomplete) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 overflow-hidden animate-scale-up" role="dialog" aria-label="Suggestions de recherche">
                {/* 🎯 CORRECTION STRICTE DES WARNINGS SÉCURITÉ ACCESSIBILITÉ RADIX-UI */}
                <h2 className="sr-only">Suggestions de recherche</h2>
                <p className="sr-only">Liste prédictive des sacs de riz disponibles</p>
                
                <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-50 mb-1">
                  Produits correspondants
                </div>
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => executeSearch(product.name)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate group-hover:text-[#1A6D00] uppercase">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Sac de {product.weight} kg • {new Intl.NumberFormat('fr-FR').format(product.price)} CFA
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* BOUTON WHATSAPP NOMAR DIRECT */}
            <a 
              href="https://wa.me/2250759777796" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Discuter sur WhatsApp"
              className="p-2.5 rounded-xl transition-all duration-200 hover:bg-emerald-50 text-slate-500 hover:text-[#1A6D00] flex items-center justify-center relative group"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md font-bold tracking-wide whitespace-nowrap">
                WhatsApp NoMar
              </span>
            </a>

            {/* BOUTON PANIER */}
            <Link to="/panier" className={`p-2.5 rounded-xl transition-all duration-200 relative flex items-center justify-center group ${isActive('/panier') ? 'bg-[#1A6D00]/10 text-[#1A6D00]' : 'hover:bg-slate-50 text-slate-500 hover:text-[#1A6D00]'}`}>
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4A373] text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* BOUTON SÉCURISÉ CONNEXION ADMIN */}
            <Link 
              to="/admin" 
              title="Espace Administration"
              className={`p-2.5 rounded-xl transition-all duration-200 relative flex items-center justify-center group ${
                isActive('/admin') || location.pathname.startsWith('/admin')
                  ? 'bg-[#1A6D00]/10 text-[#1A6D00]' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-[#1A6D00]'
              }`}
            >
              <ShieldCheck size={19} />
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md font-bold tracking-wide whitespace-nowrap">
                NM-Management
              </span>
            </Link>

            {/* ICONE MENU BURGER MOBILE */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-slate-50 text-slate-500 rounded-xl cursor-pointer">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-5 shadow-xl">
          <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <button onClick={() => executeSearch()} className="text-slate-400 hover:text-[#1A6D00] cursor-pointer">
              <Search size={18} />
            </button>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Rechercher un sac de riz sur NoMar..." 
              className="bg-transparent border-none outline-none text-sm w-full ml-2 font-semibold" 
            />
          </div>
          <div className="flex flex-col gap-4 font-black uppercase tracking-wider text-slate-600 text-xs">
            <Link to="/catalogue" className="hover:text-[#1A6D00] py-1 flex items-center gap-2"><Layers size={14}/> Catalogue complet</Link>
            
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => handleCategoryClick(cat)}
                className="text-left text-slate-400 normal-case font-bold pl-6 hover:text-[#1A6D00] -mt-2"
              >
                • Riz {cat}
              </button>
            ))}

            <Link to="/a-propos" className="hover:text-[#1A6D00] py-1 flex items-center gap-2"><BookOpen size={14}/> Notre Histoire</Link>
            <Link to="/contact" className="hover:text-[#1A6D00] py-1 flex items-center gap-2"><Phone size={14}/> Nous Contacter</Link>
            
            <a href="https://wa.me/2250759777796" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A6D00] py-1 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              Nous écrire sur WhatsApp
            </a>

            <div className="border-t border-slate-100 my-1"></div>
            
            {/* ACCÈS ADMIN DANS LE MENU MOBILE */}
            <Link to="/admin" className="hover:text-[#1A6D00] py-1 flex items-center gap-2 text-[#1A6D00]">
              <ShieldCheck size={14}/> Espace NM-Management
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;