import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import du Context
import { ShopProvider } from './context/ShopContext'

// Import des Pages
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import APropos from './pages/APropos' 
import Contact from './pages/Contact' 
import AdminLogin from './pages/AdminLogin' // 👈 IMPORT DE LA PAGE DE CONNEXION ADMIN
import AdminDashboard from './pages/AdminDashboard' // 👈 IMPORT DU NOUVEAU DASHBOARD
import SuccessPage from './pages/SuccessPage' // 👈 1. ON IMPORTE LA PAGE DE SUCCÈS ICI

// Import des Composants globaux
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CheckoutPage from './components/CheckoutPage' // 👈 2. ON IMPORTE LE FORMULAIRE EXPRESS ICI

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#007A00] selection:text-white">
          
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Route Accueil */}
              <Route path="/" element={<Home />} />
              
              {/* Route Catalogue */}
              <Route path="/catalogue" element={<Catalogue />} />
              
              {/* Route Notre Histoire */}
              <Route path="/a-propos" element={<APropos />} />
              
              {/* Route Contactez-nous */}
              <Route path="/contact" element={<Contact />} />
              
              {/* Route Panier : On affiche directement le formulaire express de composants */}
              <Route path="/panier" element={<CheckoutPage />} /> {/* 👈 3. REMPLACÉ PAR CHECKOUTPAGE */}
              
              {/* Route Succès Paiement */}
              <Route path="/commande-confirmee" element={<SuccessPage />} /> {/* 👈 4. NOUVELLE ROUTE APRÈS PAIEMENT */}
              
              {/* Route Admin : Formulaire de connexion pour l'administrateur */}
              <Route path="/admin" element={<AdminLogin />} /> {/* 👈 MODIFIÉ POUR LA PAGE DE LOGIN */}

              {/* Route Dashboard Admin : Accès sécurisé au tableau de bord */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* 👈 NOUVELLE ROUTE SÉCURISÉE */}
            </Routes>
          </main>
          
          <Footer />
          
        </div>
      </Router>
    </ShopProvider>
  )
}

export default App