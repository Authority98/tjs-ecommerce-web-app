import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TreePine, Menu, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useState } from 'react'

const Header: React.FC = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/', label: 'Home', external: true },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/#services', label: 'Services', external: true },
    { path: '/', label: 'Shop Now', external: false },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/#portfolio', label: 'Portfolio', external: true },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/#contact', label: 'Contact', external: true },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/#testimonials', label: 'Testimonials', external: true }
  ]

  return (
    <header className="relative backdrop-blur-xl bg-transparent sticky top-0 z-50">
      <div className="relative max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 py-4">
        <div className="flex justify-between items-center h-24 py-4">
          <Link to="/" className="flex items-center group">
            <div className="relative">
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
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => {
              const isActive = !item.external && (location.pathname === item.path || (item.label === 'Shop Now' && location.pathname !== '/'))
              return (
                <div key={item.path}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative px-4 py-3 font-dosis whitespace-nowrap transition-colors duration-200 group text-white hover:text-[#d9a66c]"
                      style={{fontSize: '17px', lineHeight: '22px', fontWeight: 700}}
                    >
                      <span>{item.label}</span>
                      {/* Hover underline */}
                      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#d9a66c] transition-all duration-200 opacity-0 group-hover:opacity-100"></div>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`relative px-4 py-3 font-dosis whitespace-nowrap transition-colors duration-200 group ${
                        isActive
                          ? 'text-[#d9a66c]'
                          : 'text-white hover:text-[#d9a66c]'
                      }`}
                      style={{fontSize: '17px', lineHeight: '22px', fontWeight: 700}}
                    >
                      <span>{item.label}</span>
                      {/* Hover/Active underline */}
                      <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#d9a66c] transition-all duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}></div>
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="flex items-center space-x-6">
            {/* Contact Information */}
            <div className="hidden md:flex items-center space-x-6 text-[#D9A66C] ml-8">
              <a 
                href="https://wa.me/6583392574" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
              >
                <FaWhatsapp className="h-6 w-6" />
                <span className="font-medium">+65 8339 2574</span>
              </a>
              <a 
                href="mailto:sales@twinklejingle.net" 
                className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
              >
                <MdEmail className="h-6 w-6" />
                <span className="font-medium">sales@twinklejingle.net</span>
              </a>
            </div>
            
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-white hover:text-[#d9a66c] transition-colors duration-200"
            >
              <div>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-transparent shadow-xl z-40">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-4">
                {menuItems.map((item, index) => {
                  const isActive = !item.external && (location.pathname === item.path || (item.label === 'Shop Now' && location.pathname !== '/'))
                  return (
                    <div key={item.path}>
                      {item.external ? (
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="relative flex items-center p-4 font-dosis group transition-colors duration-200 text-white hover:text-[#d9a66c]"
                          style={{fontSize: '17px', lineHeight: '22px', fontWeight: 700}}
                        >
                          <div className="flex-1">
                            <span>{item.label}</span>
                            <div className="h-0.5 bg-[#d9a66c] mt-1 transition-all duration-200 w-0 group-hover:w-full" />
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className="transition-colors duration-200 text-white group-hover:text-[#d9a66c]">
                            →
                          </div>
                        </a>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`relative flex items-center p-4 font-dosis group transition-colors duration-200 ${
                            isActive
                              ? 'text-[#d9a66c]'
                              : 'text-white hover:text-[#d9a66c]'
                          }`}
                          style={{fontSize: '17px', lineHeight: '22px', fontWeight: 700}}
                        >
                          <div className="flex-1">
                            <span>{item.label}</span>
                            <div
                              className={`h-0.5 bg-[#d9a66c] mt-1 transition-all duration-200 ${
                                isActive ? 'w-full' : 'w-0 group-hover:w-full'
                              }`}
                            />
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className={`transition-colors duration-200 ${
                            isActive ? 'text-[#d9a66c]' : 'text-white group-hover:text-[#d9a66c]'
                          }`}>
                            →
                          </div>
                        </Link>
                      )}
                    </div>
                  )
                })}

              </div>
            </div>
          </div>
        )}
    </header>
  )
}

export default Header