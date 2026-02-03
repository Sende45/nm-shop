import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Colonne 1 : À propos */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg"></span>
            </div>
            <span className="text-xl font-black text-white tracking-tighter">NM-SHOP</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Le spécialiste du matériel agricole et des semences de qualité. Nous accompagnons les agriculteurs vers une production durable et performante depuis 2026.
          </p>
          <div className="flex gap-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Colonne 2 : Liens rapides */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navigation</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Accueil</Link></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Notre Catalogue</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Nos Conseils</a></li>
            <li><Link to="/panier" className="hover:text-indigo-400 transition-colors">Mon Panier</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Contact */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-indigo-500" /> +225 0707197439
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-indigo-500" /> contact@nm-shop.ci
            </li>
            <li className="flex items-center gap-3 italic text-slate-400">
              <MapPin size={16} className="text-indigo-500" /> RueA35, Cocody-Abidjan
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
          <p className="text-xs mb-4 text-slate-400">Recevez nos offres exclusives et conseils agricoles.</p>
          <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700 focus-within:border-indigo-500 transition-all">
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className="bg-transparent border-none focus:ring-0 text-xs flex-1 px-3"
            />
            <button className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500 transition-colors">
              <ArrowRight size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Copyright & Mentions */}
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <p>© 2026 NM-SHOP. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300">Conditions Générales</a>
          <a href="#" className="hover:text-slate-300">Politique de Confidentialité</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;