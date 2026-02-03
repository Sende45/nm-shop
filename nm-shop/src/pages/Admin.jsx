import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, PackagePlus, DollarSign, Tag, Loader2 } from 'lucide-react';

const AdminAddProduct = () => {
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Prévisualisation de l'image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Veuillez ajouter une image !");
    setLoading(true);

    try {
      const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, "products"), {
        ...formData,
        imageUrl: url,
        price: parseFloat(formData.price),
        createdAt: new Date()
      });

      alert("Produit ajouté au terroir NM-Shop !");
      setFormData({ name: '', price: '', category: '' });
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Erreur Firebase :", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-2xl shadow-slate-200 rounded-[2rem] overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <PackagePlus className="text-indigo-400" />
            <h2 className="text-2xl font-black tracking-tight">Gestion du Stock</h2>
          </div>
          <p className="text-slate-400 text-sm">Ajoutez un nouvel article agricole à la boutique NM-Shop.</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Nom du Produit */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Nom de l'article</label>
            <div className="relative">
              <input required type="text" placeholder="Ex: Tracteur compact, Semences de Maïs..." 
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 pl-4 transition-all outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prix */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Prix de vente (CFA)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-bold">F</span>
                <input required type="number" step="0.01" placeholder="0.00" 
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 pl-8 outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Catégorie</label>
              <select required className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 outline-none appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">Sélectionner...</option>
                <option value="Outils">🚜 Outils & Matériel</option>
                <option value="Semences">🌱 Semences</option>
                <option value="Engrais">🍃 Engrais & Soins</option>
              </select>
            </div>
          </div>

          {/* Upload Image Stylisé */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Image du produit</label>
            <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all overflow-hidden">
              {preview ? (
                <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">Cliquez pour uploader</p>
                  <p className="text-xs text-slate-400">PNG, JPG ou WEBP</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          <button type="submit" disabled={loading} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-4 rounded-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
            {loading ? <Loader2 className="animate-spin" /> : <PackagePlus size={20} />}
            {loading ? "Mise en ligne..." : "Publier sur NM-Shop"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;