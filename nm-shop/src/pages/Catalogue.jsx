import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ShoppingBag } from 'lucide-react';

const Catalogue = () => {
  const { products, addToCart } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États de filtrage
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedWeights, setSelectedWeights] = useState([]); // Tableau des poids cochés

  // Récupération de la recherche depuis l'URL (Navbar)
  const searchQuery = searchParams.get('search') || '';

  // Liste des formats disponibles demandés (5, 10, 22.5, 25, 50 kg)
  const availableWeights = [5, 10, 22.5, 25, 50];

  // Catégories uniques extraites dynamiquement
  const categories = ['Tous', ...new Set(products?.map(p => p.category) || [])];

  // Gestion du choix des poids (Checkbox)
  const handleWeightChange = (weight) => {
    if (selectedWeights.includes(weight)) {
      setSelectedWeights(selectedWeights.filter(w => w !== weight));
    } else {
      setSelectedWeights([...selectedWeights, weight]);
    }
  };

  // Logique de filtrage combinée (Recherche + Catégorie + Poids)
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    
    const matchesWeight = selectedWeights.length === 0 || selectedWeights.includes(product.weight);

    return matchesSearch && matchesCategory && matchesWeight;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 selection:bg-[#007A00] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* EN-TÊTE DU CATALOGUE - NOMAR BRAND */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/60 pb-8 mb-12 gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-[#D4A373] uppercase bg-[#D4A373]/10 px-3 py-1 rounded-md">
              Boutique Directe
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-brand-dark mt-2 tracking-tight">
              Le Catalogue <span className="text-[#007A00]">NoMar</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-slate-400 bg-white border border-slate-100 px-4 py-2.5 rounded-xl shadow-2xs">
            <span className="text-[#007A00] font-black">{filteredProducts.length}</span> variétés de riz trouvées
          </p>
        </div>

        {/* STRUCTURE CONTENU ASYMÉTRIQUE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* PANNEAU DE FILTRES (Colonne gauche) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-xs lg:sticky lg:top-28 space-y-8">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <SlidersHorizontal size={16} className="text-[#007A00]" />
              <h3 className="font-black text-sm uppercase tracking-wider text-brand-dark">Ajuster les critères</h3>
            </div>

            {/* FILTRE 1 : PAR CATÉGORIES */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Catégories</h4>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-[#007A00] text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#007A00]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTRE 2 : PAR CONTENANCE / FORMAT DU SAC */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Format du Sac</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {availableWeights.map((weight) => (
                  <label 
                    key={weight} 
                    className="flex items-center gap-3 text-xs font-bold text-slate-600 cursor-pointer group select-none"
                  >
                    <input 
                      type="checkbox"
                      checked={selectedWeights.includes(weight)}
                      onChange={() => handleWeightChange(weight)}
                      className="rounded border-slate-200 text-[#007A00] focus:ring-[#007A00]/30 h-4 w-4 cursor-pointer"
                    />
                    <span className="group-hover:text-brand-dark transition-colors">
                      Sac de {weight.toString().replace('.', ',')} kg
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* BOUTON RESET SI DES FILTRES SONT ACTIFS */}
            {(selectedCategory !== 'Tous' || selectedWeights.length > 0 || searchQuery !== '') && (
              <button 
                onClick={() => {
                  setSelectedCategory('Tous');
                  setSelectedWeights([]);
                  setSearchParams({}); 
                }}
                className="w-full text-center py-2.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl text-xs font-bold transition-colors border border-slate-100 cursor-pointer"
              >
                Réinitialiser tous les filtres
              </button>
            )}
          </div>

          {/* GRILLE DE PRODUITS DYNAMIQUE (Colonne droite) */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-scale-up">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              /* ÉCRAN PANNE DE RECHERCHE */
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed text-slate-400 flex flex-col items-center justify-center p-6 shadow-2xs">
                <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="font-black text-brand-dark text-lg mb-1 tracking-tight">Aucun résultat trouvé</h3>
                <p className="text-xs max-w-xs font-medium leading-relaxed">
                  Aucune variété de riz ne correspond à votre combinaison de filtres ou à votre recherche textuelle actuelle sur NoMar.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Catalogue;