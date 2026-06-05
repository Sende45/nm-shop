import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// 1. CORRECTION DU CHEMIN : Ton fichier s'appelle firebase.js et se trouve dans src/ (un dossier plus haut)
import { auth } from '../firebase'; 
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'; // 👈 AJOUT DES ICÔNES EYE ET EYEOFF

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 ÉTAT POUR GÉRER LA VISIBILITÉ DU MOT DE PASSE
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ton UID Admin Unique validé par tes règles Firestore
  const ADMIN_UID = "GjgjlebQ83PSa7qoFBdRCb67Z2E3";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Connexion via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Vérification stricte de l'UID Admin NoMar
      if (user.uid === ADMIN_UID) {
        // Connexion réussie -> Redirection vers le tableau de bord sécurisé
        // 2. CORRECTION DE LA ROUTE : Doit matcher exactement avec le chemin de ton App.jsx
        navigate('/admin/dashboard'); 
      } else {
        // Si l'UID ne correspond pas, on déconnecte immédiatement par sécurité
        await auth.signOut();
        setError("Accès refusé. Vous n'êtes pas configuré comme administrateur principal.");
      }
    } catch (err) {
      console.error("Erreur d'authentification admin :", err);
      // Messages d'erreur adaptés et propres
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Identifiants de connexion incorrects.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Compte temporairement bloqué suite à de trop nombreuses tentatives. Réessayez plus tard.");
      } else {
        setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 font-sans selection:bg-[#1A6D00] selection:text-white">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl p-6 md:p-8 transform transition-all duration-300">
        
        {/* En-tête du formulaire */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-[#1A6D00]/10 text-[#1A6D00] rounded-xl flex items-center justify-center mb-4 shadow-xs">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-black uppercase text-slate-800 tracking-wide">
            NM-Management
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Espace d'administration réservé • NoMar Shop
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Formulaire de connexion */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Champ Email */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-2">
              Adresse Email Admin
            </label>
            <div className="relative flex items-center bg-slate-50/80 rounded-xl px-4 py-3 border border-slate-100 focus-within:border-[#1A6D00]/30 focus-within:bg-white focus-within:shadow-xs transition-all duration-200">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@nomar.com"
                className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full ml-3 font-semibold text-slate-700 placeholder-slate-400"
                disabled={loading}
              />
            </div>
          </div>

          {/* Champ Mot de Passe */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 tracking-wider mb-2">
              Mot de passe
            </label>
            {/* Ajout de pr-12 sur le conteneur pour laisser de la place au bouton œil à droite */}
            <div className="relative flex items-center bg-slate-50/80 rounded-xl pl-4 pr-12 py-3 border border-slate-100 focus-within:border-[#1A6D00]/30 focus-within:bg-white focus-within:shadow-xs transition-all duration-200">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"} // 👈 LE TYPE S'ADAPTE DYNAMIQUEMENT ICI
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full ml-3 font-semibold text-slate-700 placeholder-slate-400"
                disabled={loading}
              />
              {/* Bouton pour basculer l'état showPassword */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A6D00] hover:bg-[#155400] text-white font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md shadow-emerald-900/10 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Vérification des accès...
              </>
            ) : (
              <>
                Se connecter au Dashboard
                <ArrowRight size={14} />
              </>
            )}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;