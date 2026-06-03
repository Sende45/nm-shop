import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import du Context
import { ShopProvider } from './context/ShopContext'

// Import des Pages
import Home from './pages/Home'
import Cart from './pages/Cart' 
import Catalogue from './pages/Catalogue'
import APropos from './pages/APropos' // 👈 Nouvelle page Histoire importée
import Contact from './pages/Contact' // 👈 Nouvelle page Contact importée
import AdminAddProduct from './pages/Admin' 

// Import des Composants globaux
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <ShopProvider>
      <Router>
        {/* Structure flex-col pour que le footer reste toujours collé en bas */}
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#007A00] selection:text-white">
          
          {/* Barre de navigation globale */}
          <Navbar />
          
          {/* Zone principale dynamique */}
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
              
              {/* Route Panier */}
              <Route path="/panier" element={<Cart />} />
              
              {/* Route Admin */}
              <Route path="/admin" element={<AdminAddProduct />} />
            </Routes>
          </main>
          
          {/* Footer officiel NoMar */}
          <Footer />
          
        </div>
      </Router>
    </ShopProvider>
  )
}

export default App