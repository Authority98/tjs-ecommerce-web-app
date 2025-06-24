import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import ProductPage from './pages/ProductPage'
import TreeCustomization from './pages/TreeCustomization'
import CheckoutPage from './pages/CheckoutPage'
import ThankYouPage from './pages/ThankYouPage'
import AdminPage from './pages/AdminPage'
import CategorySelection from './pages/CategorySelection'
import Header from './components/Header'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 transition-colors duration-300">
          <Header />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<CategorySelection />} />
              <Route path="/products/:category" element={<ProductPage />} />
              <Route path="/tree-customization/:productId" element={<TreeCustomization />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* Redirect any unknown routes to category selection */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App