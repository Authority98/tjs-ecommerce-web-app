import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TreePine, Settings, Sparkles, Ribbon, Gift, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header: React.FC = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { path: '/products/trees', label: 'Trees', icon: TreePine, iconBg: 'bg-purple-500', gradient: 'from-purple-600 via-violet-600 to-fuchsia-500' },
    { path: '/products/decorations', label: 'Decorations', icon: Sparkles, iconBg: 'bg-fuchsia-500', gradient: 'from-purple-500 via-fuchsia-500 to-violet-400' },
    { path: '/products/ribbons', label: 'Ribbons', icon: Ribbon, iconBg: 'bg-violet-500', gradient: 'from-violet-400 via-purple-400 to-fuchsia-300' },
    { path: '/gift-cards', label: 'Gift Cards', icon: Gift, iconBg: 'bg-pink-500', gradient: 'from-pink-400 via-rose-400 to-red-300' }
  ]

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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-xl">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path.split('/')[2])
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                     to={item.path}
                     className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-dosis font-medium group whitespace-nowrap ${
                       isActive
                         ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 font-bold shadow-lg shadow-purple-300/60'
                         : 'text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700'
                     }`}
                   >
                    <motion.div
                       className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300 ${
                         isActive ? 'shadow-lg' : ''
                       }`}
                       whileHover={{ rotate: [0, -10, 10, 0] }}
                       transition={{ duration: 0.3 }}
                     >
                       <item.icon className="h-4 w-4 text-white" />
                     </motion.div>
                     <span>{item.label}</span>
                    
                    {/* Subtle sparkle effect for active items */}
                    {isActive && (
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            {/* Desktop Admin Link */}
            <Link
              to="/admin"
              className="hidden md:block p-3 text-purple-500 hover:text-purple-700 transition-all rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:scale-110"
            >
              <Settings className="h-6 w-6" />
            </Link>
            
            {/* Mobile Hamburger Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-purple-600 hover:text-purple-700 transition-all rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-purple-50 via-violet-100 to-fuchsia-200 backdrop-blur-xl border-b border-gray-200/50 shadow-xl z-40"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-4">
                {menuItems.map((item, index) => {
                  const isActive = location.pathname.includes(item.path.split('/')[2])
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-4 p-4 rounded-2xl transition-all font-dosis font-medium group ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 font-bold shadow-lg shadow-purple-300/60'
                            : 'text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700'
                        }`}
                      >
                        <motion.div
                          className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                          whileHover={{ 
                            rotate: [0, -10, 10, 0],
                            scale: 1.1
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          <item.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        
                        <div className="flex-1">
                          <span className="text-lg font-semibold">{item.label}</span>
                          <motion.div
                            className="h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full mt-1"
                            initial={{ width: 0 }}
                            animate={{ width: isActive ? '100%' : '0%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        
                        {/* Cute sparkle animation for active items */}
                        {isActive && (
                          <motion.div
                            animate={{ 
                              rotate: [0, 360],
                              scale: [1, 1.3, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                          </motion.div>
                        )}
                        
                        {/* Cute arrow indicator */}
                        <motion.div
                          animate={{ x: isActive ? 5 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-purple-400"
                        >
                          →
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
                
                {/* Mobile Admin Link */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.length * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 p-4 rounded-2xl transition-all font-dosis font-medium text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 group"
                  >
                    <motion.div
                      className="w-12 h-12 bg-gray-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.1
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <Settings className="h-6 w-6 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <span className="text-lg font-semibold">Admin</span>
                    </div>
                    
                    <motion.div
                      className="text-purple-400"
                    >
                      →
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header