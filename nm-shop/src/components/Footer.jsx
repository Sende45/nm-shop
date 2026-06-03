import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1A6D00] text-white/80 pt-20 pb-8 border-t border-white/10 relative overflow-hidden font-['Gitaluevo'] selection:bg-[#F5C000] selection:text-slate-900">
      
      {/* Halo lumineux en arrière-plan utilisant ton vert clair #AFD13F */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_bottom_right,rgba(175,209,99,0.15),transparent_65%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 relative z-10">
        
        {/* Colonne 1 : À propos & Identité Officielle NoMar */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group/logo w-fit focus:outline-none">
            <div className="flex items-center h-8 relative bg-white/10 px-3 py-5 rounded-xl border border-white/10 backdrop-blur-xs">
              {/* NoMar écrit en Blanc #ffffff sur ton fond vert */}
              <span className="text-2xl font-black text-[#ffffff] tracking-tight uppercase flex items-center leading-none select-none">
                N
                {/* Le "O" stylisé en grain de riz vertical */}
                <span className="inline-block w-[12px] h-[18px] border-[2.5px] border-[#ffffff] rounded-full mx-0.5 rotate-3 bg-transparent self-center"></span>
                mar
              </span>
              
              {/* L'épi de riz doré penché au code couleur #F5C000 */}
              <div className="text-[#F5C000] ml-1 opacity-95 transition-transform duration-300 group-hover/logo:scale-110 group-hover/logo:rotate-6 self-start -mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22C10 22 16 16 22 2" />
                  <path d="M12 16C14 14 18 14 18 11" />
                  <path d="M15 11C17 9 19 10 21 7" />
                </svg>
              </div>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-white/90 font-medium">
            Votre distributeur de confiance pour l'achat de sacs de riz de premier choix. Nous sélectionnons le meilleur du riz local et des variétés parfumées d'exception pour toutes les familles.
          </p>
          {/* Réseaux Sociaux avec effets sur ton Jaune #F5C000 */}
          <div className="flex gap-3 pt-2">
            {[
              { Icon: Facebook, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                className="p-3 bg-white/10 hover:bg-[#F5C000] text-white hover:text-slate-900 rounded-xl transition-all duration-300 border border-white/10 hover:border-[#F5C000] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <social.Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Colonne 2 : Liens de navigation */}
        <div>
          <h4 className="text-[#F5C000] font-black mb-6 uppercase text-xs tracking-[0.15em] border-l-2 border-[#AFD13F] pl-3">
            Navigation
          </h4>
          <ul className="space-y-3 text-sm font-semibold">
            {[
              { name: 'Catalogue complet', path: '/catalogue' },
              { name: 'Notre Histoire', path: '/a-propos' },
              { name: 'Nous Contacter', path: '/contact' }
            ].map((item, idx) => (
              <li key={idx}>
                <Link to={item.path} className="hover:text-[#F5C000] text-white/80 transition-colors duration-200 flex items-center gap-1 group w-fit">
                  {item.name}
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#F5C000]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 3 : Informations de Contact Direct */}
        <div>
          <h4 className="text-[#F5C000] font-black mb-6 uppercase text-xs tracking-[0.15em] border-l-2 border-[#AFD13F] pl-3">
            Service Client
          </h4>
          <ul className="space-y-4 text-sm font-medium text-white/90">
            <li className="flex items-center gap-3.5 group">
              <span className="p-2 bg-white/10 rounded-lg text-[#F5C000] border border-white/5 group-hover:bg-white group-hover:text-[#1A6D00] transition-colors duration-200">
                <Phone size={14} />
              </span>
              <a href="tel:+2250707197439" className="hover:text-[#F5C000] transition-colors font-semibold">
                +225 07 07 37 71 74
              </a>
            </li>
            <li className="flex items-center gap-3.5 group">
              <span className="p-2 bg-white/10 rounded-lg text-[#F5C000] border border-white/5 group-hover:bg-white group-hover:text-[#1A6D00] transition-colors duration-200">
                <Mail size={14} />
              </span>
              <a href="mailto:contact@nomar.ci" className="hover:text-[#F5C000] transition-colors font-semibold">
                contact@nomar.ci
              </a>
            </li>
            <li className="flex items-start gap-3.5 text-white/80">
              <span className="p-2 bg-white/10 rounded-lg text-[#F5C000] border border-white/5 mt-0.5 shrink-0">
                <MapPin size={14} />
              </span>
              <span className="leading-relaxed text-xs">
                Rue A35, Cocody<br />
                <span className="text-white font-semibold">Abidjan, Côte d'Ivoire</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Newsletter / Alertes de réassort */}
        <div>
          <h4 className="text-[#F5C000] font-black mb-6 uppercase text-xs tracking-[0.15em] border-l-2 border-[#AFD13F] pl-3">
            Bons Plans & Alerte Stock
          </h4>
          <p className="text-xs mb-4 text-white/80 leading-relaxed font-medium">
            Soyez notifié dès le réapprovisionnement de nos sacs de riz Jasmin et profitez des tarifs de vente directe.
          </p>
          
          <div className="flex bg-white/10 p-1.5 rounded-xl border border-white/10 focus-within:border-[#F5C000] transition-all duration-300 backdrop-blur-xs">
            <input 
              type="email" 
              placeholder="Votre adresse email..." 
              className="bg-transparent border-none outline-none focus:ring-0 text-xs flex-1 px-3 text-white placeholder-white/50 font-semibold"
            />
            <button className="group/btn bg-[#F5C000] p-2.5 rounded-lg hover:bg-white text-slate-900 transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center">
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Zone légale inférieure teintée avec ton Bronze #BF9328 */}
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/60 font-bold uppercase tracking-wider">
        <p className="font-semibold text-white/70">
          © {new Date().getFullYear()} NOMAR. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#BF9328] text-white/60 transition-colors flex items-center gap-0.5 group">
            Conditions de Livraison <ArrowUpRight size={10} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
          <a href="#" className="hover:text-[#BF9328] text-white/60 transition-colors flex items-center gap-0.5 group">
            Politique de Confidentialité <ArrowUpRight size={10} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;