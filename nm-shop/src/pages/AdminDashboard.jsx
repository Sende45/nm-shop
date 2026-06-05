import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ShoppingBag, Package, CheckCircle, Clock, RefreshCw, Search, LogOut, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // États du dashboard
  const [activeTab, setActiveTab] = useState('analytics');
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, ordersCount: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const currentMonth = `${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' CFA';
  };

  // 1. Sécurité d'accès : Protéger la route
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.uid === "GjgjlebQ83PSa7qoFBdRCb67Z2E3") {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/admin'); // Redirige vers la page de login si non connecté ou mauvais compte
      }
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, [auth, navigate]);

  // 2. Écoute des données Firestore
  useEffect(() => {
    if (!user) return;

    const qTx = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsubTx = onSnapshot(qTx, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubProd = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAnalytics = onSnapshot(doc(db, 'analytics', currentMonth), (snapshot) => {
      if (snapshot.exists()) setAnalytics(snapshot.data());
    });

    return () => {
      unsubTx();
      unsubProd();
      unsubAnalytics();
    };
  }, [user, currentMonth]);

  const handleLogout = () => signOut(auth).then(() => navigate('/admin'));

  const handleUpdateStatus = async (txId, newStatus) => {
    try {
      await updateDoc(doc(db, 'transactions', txId), { status: newStatus });
    } catch (error) {
      alert(`Erreur de mise à jour : ${error.message}`);
    }
  };

  const handleUpdateStock = async (prodId, newStock) => {
    try {
      await updateDoc(doc(db, 'products', prodId), { stock: parseInt(newStock, 10) || 0 });
    } catch (error) {
      alert(`Erreur de stock : ${error.message}`);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.customerPhone?.includes(searchTerm)
  );

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="animate-spin text-[#007A00]" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-slate-800 font-sans">
      
      {/* EN-TÊTE AVEC BOUTON DÉCONNEXION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">NM-Management</h1>
          <p className="text-sm text-slate-400 font-medium">Connecté en tant que : <span className="text-slate-600 font-bold">{user.email}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Quitter le Dashboard
          </button>
        </div>
      </div>

      {/* NAVIGATION DES ONGLETS */}
      <div className="flex border-b border-slate-200 mb-8 gap-2">
        <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === 'analytics' ? 'border-[#007A00] text-[#007A00]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <BarChart3 size={16} /> Vue d'ensemble
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === 'orders' ? 'border-[#007A00] text-[#007A00]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <ShoppingBag size={16} /> Commandes ({transactions.length})
        </button>
        <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === 'inventory' ? 'border-[#007A00] text-[#007A00]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <Package size={16} /> Stocks & Prix
        </button>
      </div>

      {/* CONTENU ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Chiffre d'Affaires ({currentMonth})</p>
                <h3 className="text-2xl font-black text-[#007A00]">{formatPrice(analytics.totalRevenue || 0)}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-[#007A00]"><BarChart3 size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Volume de Commandes</p>
                <h3 className="text-2xl font-black text-slate-900">{analytics.ordersCount || 0} ventes</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><ShoppingBag size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Alertes Rupture Stock</p>
                <h3 className="text-2xl font-black text-rose-600">{products.filter(p => p.stock <= 0).length} articles</h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600"><Package size={24} /></div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU COMMANDES */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Rechercher par nom ou numéro..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#007A00] transition-colors" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                    <th className="p-4">Client / Contact</th>
                    <th className="p-4">Destination (Abidjan)</th>
                    <th className="p-4">Articles</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4">Passerelle</th>
                    <th className="p-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-black text-slate-900">{tx.customerName || 'Client Inconnu'}</p>
                        <p className="text-xs text-slate-400 font-sans">{tx.customerPhone}</p>
                      </td>
                      <td className="p-4 text-xs max-w-xs truncate text-slate-600" title={tx.address}>{tx.address || 'Non renseignée'}</td>
                      <td className="p-4 text-xs space-y-0.5">
                        {tx.items?.map((item, idx) => (
                          <div key={idx} className="text-slate-600">• {item.name} <span className="font-bold text-[#007A00]">x{item.quantity}</span></div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-slate-900">{formatPrice(tx.totalAmount || 0)}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${tx.gateway === 'fedapay' ? 'bg-emerald-100 text-emerald-800' : tx.gateway === 'stripe' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'}`}>{tx.gateway || 'Espèce'}</span>
                      </td>
                      <td className="p-4">
                        <select value={tx.status || 'pending'} onChange={(e) => handleUpdateStatus(tx.id, e.target.value)} className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${tx.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                          <option value="pending">En attente / Livraison</option>
                          <option value="completed">Livré & Encaissé</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU INVENTAIRE */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                  <th className="p-4">Produit</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4">Stock en magasin</th>
                  <th className="p-4">État global</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100" />}
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight">{product.name}</p>
                          {product.weight && <p className="text-xs text-slate-400">Sac de {product.weight} kg</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-500 uppercase font-black">{product.category || 'Riz Premium'}</td>
                    <td className="p-4 font-bold text-slate-900">{formatPrice(product.price || 0)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input type="number" value={product.stock ?? 0} onChange={(e) => handleUpdateStock(product.id, e.target.value)} className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-center text-sm font-bold focus:outline-none focus:border-[#007A00]" />
                        <span className="text-xs text-slate-400">sacs</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-md"><CheckCircle size={12} /> Disponible</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md"><Clock size={12} /> Rupture</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;