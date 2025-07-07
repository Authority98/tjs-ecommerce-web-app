import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import ProductPage from './pages/ProductPage'
import TreeCustomization from './pages/TreeCustomization'
import CheckoutPage from './pages/CheckoutPage'
import ThankYouPage from './pages/ThankYouPage'
import AdminPage from './pages/AdminPage'
import CategorySelection from './pages/CategorySelection'
import GiftCardPage from './pages/GiftCardPage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative" style={{backgroundImage: 'url(/assets/images/background-image.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(180deg, #000000 0%, #510256 100%)', opacity: 0.93, transition: 'background 0.3s, border-radius 0.3s, opacity 0.3s'}}></div>
        <div className="relative flex flex-col flex-1 z-10">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<CategorySelection />} />
              <Route path="/products/:category" element={<ProductPage />} />
              <Route path="/tree-customization/:productId" element={<TreeCustomization />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/gift-cards" element={<GiftCardPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App