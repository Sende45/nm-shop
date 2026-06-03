import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Intégration future Firebase ou Webhook de contact
    console.log("Formulaire soumis :", formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 selection:bg-[#007A00] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* ENTÊTE DE LA PAGE */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#D4A373] uppercase bg-[#D4A373]/10 px-3 py-1 rounded-md">
            Assistance & Commande Gros
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tight">
            CONTACTEZ LA MAISON <span className="text-[#007A00]">NOMAR</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs md:text-sm leading-relaxed">
            Une question sur nos stocks, besoin d'un devis pour un commerce de gros ou de détails ? Notre équipe commerciale vous répond sous quelques heures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* BLOC COORDONNÉES DE CONFIANCÈ (4 colonnes) */}
          <div className="lg:col-span-4 space-y-4">
            {[
              { icon: <Phone size={18} />, title: "Téléphone direct", content: "+225 07 07 37 71 74 / 07 16 32 59 25 / 07 19 30 65 60", href: "tel:+2250707197439" },
              { icon: <Mail size={18} />, title: "Adresse courriel", content: "contact@nomar.ci", href: "mailto:contact@nomar.ci" },
              { icon: <MapPin size={18} />, title: "Siège social", content: "Rue A35, Cocody, Abidjan", label: "Côte d'Ivoire" }
            ].map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-2xs flex gap-4 items-start">
                <span className="p-3 bg-[#007A00]/10 text-[#007A00] rounded-xl shrink-0">
                  {info.icon}
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">{info.title}</h4>
                  {info.href ? (
                    <a href={info.href} className="text-sm font-black text-brand-dark hover:text-[#007A00] transition-colors break-all">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-sm font-black text-brand-dark leading-snug">
                      {info.content} <br />
                      <span className="text-slate-400 text-xs font-semibold">{info.label}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FORMULAIRE DE CONTACT HAUT DE GAMME (8 colonnes) */}
          <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100/80 shadow-xs relative overflow-hidden">
            
            {isSubmitted ? (
              /* ÉCRAN DE RÉUSSITE ANIMÉ */
              <div className="py-12 flex flex-col items-center text-center space-y-4 animate-scale-up">
                <CheckCircle2 size={48} className="text-[#007A00] animate-bounce" />
                <h3 className="text-xl font-black text-brand-dark tracking-tight">Votre message a été transmis !</h3>
                <p className="text-slate-400 text-xs max-w-sm font-medium leading-relaxed">
                  Merci d'avoir contacté NoMar. Notre équipe commerciale prend connaissance de votre requête et reviendra vers vous par téléphone ou e-mail très rapidement.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#007A00] hover:underline cursor-pointer"
                >
                  Envoyer un nouveau message
                </button>
              </div>
            ) : (
              /* LE FORMULAIRE NATIF */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* INPUT NOM */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Nom Complet</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Koffi Kouassi"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-dark focus:ring-1 focus:ring-[#007A00]/30 focus:border-[#007A00]/40 outline-none transition-all"
                    />
                  </div>

                  {/* INPUT NUMÉRO */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Numéro de Mobile</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: +225 07 00 00 00 00"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-dark focus:ring-1 focus:ring-[#007A00]/30 focus:border-[#007A00]/40 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* INPUT EMAIL */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Adresse Électronique</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: monadresse@gmail.com"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-dark focus:ring-1 focus:ring-[#007A00]/30 focus:border-[#007A00]/40 outline-none transition-all"
                  />
                </div>

                {/* TEXTAREA MESSAGE */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Votre Message / Votre Demande</label>
                  <textarea 
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Dites-nous comment nous pouvons vous aider ou décrivez votre commande..."
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-dark focus:ring-1 focus:ring-[#007A00]/30 focus:border-[#007A00]/40 outline-none transition-all resize-none"
                  />
                </div>

                {/* BOUTON ENVOI */}
                <button 
                  type="submit"
                  className="w-full group/send bg-[#007A00] hover:bg-[#006400] text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-md shadow-emerald-950/5 flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Transmettre la demande 
                  <Send size={13} className="group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;