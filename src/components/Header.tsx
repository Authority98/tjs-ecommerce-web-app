import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TreePine, Settings, Sparkles } from 'lucide-react'

const Header: React.FC = () => {
  const location = useLocation()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-tl from-purple-50 via-violet-100 to-fuchsia-200 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-24 py-4">
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <img
                src="/assets/images/logo.webp"
                alt="Twinkle Jingle Logo"
                className="h-40 w-40 object-contain py-2"
                onError={(e) => {
                  // Fallback to TreePine icon if logo fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'block'
                }}
              />
              {/* Fallback icon (hidden by default) */}
              <TreePine className="h-8 w-8 text-[#F7B541] hidden" />
            </motion.div>
          </Link>
          
          <nav className="hidden md:flex space-x-10 text-xl">
            {[
              { path: '/products/trees', label: 'Trees', emoji: '🌲' },
              { path: '/products/decorations', label: 'Decorations', emoji: '✨' },
              { path: '/products/ribbons', label: 'Ribbons', emoji: '🎀' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-5 py-3 rounded-xl transition-all font-dosis font-medium ${
                  location.pathname.includes(item.path.split('/')[2])
                    ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 font-bold shadow-purple-300/60 scale-105'
                    : 'text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 hover:scale-102'
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="p-3 text-purple-500 hover:text-purple-700 transition-all rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:scale-110"
            >
              <Settings className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header