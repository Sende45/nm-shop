import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import du Context
import { ShopProvider } from './context/ShopContext'

// Import des Pages
import Home from './pages/Home'
import Cart from './pages/Cart' 
import AdminAddProduct from './pages/Admin' 

// Import des Composants globaux
import Navbar from './components/Navbar'
import Footer from './components/Footer' // Import du nouveau Footer

function App() {
  return (
    <ShopProvider>
      <Router>
        {/* Structure flex-col pour que le footer reste en bas */}
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Route Accueil */}
              <Route path="/" element={<Home />} />
              
              {/* Route Panier activée */}
              <Route path="/panier" element={<Cart />} />
              
              {/* Route Admin activée */}
              <Route path="/admin" element={<AdminAddProduct />} />
            </Routes>
          </main>
          
          {/* Nouveau Footer professionnel */}
          <Footer />
          
        </div>
      </Router>
    </ShopProvider>
  )
}

// CORRECTION : "App" et non "Apps"
export default App