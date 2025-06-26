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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-fuchsia-50 to-violet-100 flex flex-col">
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
    </Router>
  )
}

export default App