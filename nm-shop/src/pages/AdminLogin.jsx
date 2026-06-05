import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Authentification Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Vérification stricte de ton UID unique NoMar
      if (user.uid === "GjgjlebQ83PSa7qoFBdRCb67Z2E3") {
        
        // 3. Notification & Enregistrement de la connexion sur Firestore
        await addDoc(collection(db, 'admin_logs'), {
          adminEmail: user.email,
          uid: user.uid,
          action: "Connexion réussie au Dashboard",
          loginAt: serverTimestamp(),
          device: navigator.userAgent // Optionnel : pour savoir depuis quel appareil
        });

        // 4. Redirection vers le Dashboard de gestion
        navigate('/admin/dashboard');
      } else {
        setError("Accès refusé : Cet identifiant n'est pas enregistré comme administrateur.");
      }
    } catch (err) {
      console.error(err);
      setError("Identifiants invalides. Veuillez vérifier votre email ou mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl max-w-md w-full transition-all">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-emerald-50 rounded-2xl text-[#007A00] mb-3">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Portail NM-Admin</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Espace de restriction logistique et financier NoMar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Identifiant de connexion</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nomar.ci"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Clé secrète / Mot de passe</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-[#007A00] disabled:bg-slate-300 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? "Vérification en cours..." : "S'authentifier"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;