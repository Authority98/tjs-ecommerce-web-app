import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TreePine, Menu, X } from 'lucide-react'
import { FaEnvelope } from 'react-icons/fa'
import { BsWhatsapp } from 'react-icons/bs'
// Icons are from:
// - lucide-react: TreePine, Menu, X
// - react-icons/fa (Font Awesome): FaEnvelope
// - react-icons/bs (Bootstrap Icons): BsWhatsapp

const Header: React.FC = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Body scroll locking effect when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Lock the body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100%'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      // Add a class to handle iOS Safari issues
      document.documentElement.classList.add('overflow-hidden')
    } else {
      // Restore normal scrolling when mobile menu is closed
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.documentElement.classList.remove('overflow-hidden')
    }

    return () => {
      // Cleanup function to ensure scrolling is restored
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.documentElement.classList.remove('overflow-hidden')
    }
  }, [isMobileMenuOpen])

  const menuItems = [
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/', label: 'Home', external: true },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/#services', label: 'Services', external: true },
    { path: '/', label: 'Shop Now', external: false },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/portfolio/', label: 'Portfolio', external: true },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/#contact', label: 'Contact', external: true },
    { path: 'https://tjs-landing-page.stagingsite.duckdns.org/#testimonials', label: 'Testimonials', external: true }
  ]

  return (
    <header className="relative backdrop-blur-xl bg-transparent z-[150]">
      {/* Desktop Header */}
      <div className="relative w-full max-w-[1430px] mx-auto px-4 sm:px-6 lg:px-8 py-4 hidden md:block">
        <div className="flex items-center h-24 py-4" style={{width: '100%', gap: '40px'}}>
          <div className="flex justify-start" style={{width: '20%'}}>
            <Link to="/" className="flex flex-col items-center group">
            <div className="relative">
              <img
                src="/assets/images/logo.webp"
                alt="Twinkle Jingle Logo"
                className="h-[125px] w-[160px] object-contain py-2"
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
            <div 
               className="text-center"
               style={{
                 fontFamily: '"Dancing Script", sans-serif',
                 fontStyle: 'normal',
                 fontWeight: 500,
                 color: 'rgb(217, 166, 108)',
                 fontSize: '16px',
                 lineHeight: '21px'
               }}
             >
Event planning and decoration services
            </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="flex justify-end" style={{width: '45%'}}>
             <nav className="flex space-x-[30px] items-center">
            {menuItems.map((item) => {
              const isActive = !item.external && (location.pathname === item.path || (item.label === 'Shop Now' && location.pathname !== '/'))
              return (
                <div key={item.path}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative py-3 font-dosis whitespace-nowrap transition-colors duration-200 group text-white hover:text-[#d9a66c]"
                      style={{fontSize: '17px', lineHeight: '22px', fontWeight: 700}}
                    >
                      <span>{item.label}</span>
                      {/* Hover underline */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9a66c] transition-all duration-200 opacity-0 group-hover:opacity-100"></div>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`relative py-3 font-dosis whitespace-nowrap transition-colors duration-200 group ${
                        isActive
                          ? 'text-[#d9a66c]'
                          : 'text-white hover:text-[#d9a66c]'
                      }`}
                      style={{fontSize: '17px', lineHeight: '22px', fontWeight: 700}}
                    >
                      <span>{item.label}</span>
                      {/* Hover/Active underline */}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9a66c] transition-all duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}></div>
                    </Link>
                  )}
                </div>
              )
            })}
            </nav>
          </div>

          <div className="flex justify-end" style={{width: '35%'}}>
            {/* Contact Information */}
            <div className="flex items-center space-x-8">
              <a 
                href="https://wa.me/6583392574" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 hover:text-[#D9A66C] transition-colors duration-200"
              >
                <svg width="24px" height="24px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#D9A66C" stroke="#D9A66C">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                  <g id="SVGRepo_iconCarrier">
                    <title>whatsapp [#128]</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7599.000000)" fill="#D9A66C">
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                          <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439" id="whatsapp-[#128]"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <span className="font-medium text-white whitespace-nowrap" style={{fontSize: '17px'}}>+65 8339 2574</span>
              </a>
              <a 
                href="mailto:twinklejinglesservices@gmail.com" 
                className="flex items-center space-x-3 hover:text-[#D9A66C] transition-colors duration-200"
              >
                <FaEnvelope className="text-[#D9A66C] text-[1.5em] flex-shrink-0" />
                <span className="font-medium text-white whitespace-nowrap" style={{fontSize: '17px'}}>twinklejinglesservices@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden w-full bg-black/80 backdrop-blur-sm">
        {/* Logo centered at top */}
        <div className="flex justify-center py-2">
          <Link to="/" className="flex flex-col items-center group">
            <div className="relative">
              <img
                src="/assets/images/logo.webp"
                alt="Twinkle Jingle Logo"
                className="h-[80px] w-[120px] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'block'
                }}
              />
              <TreePine className="h-8 w-8 text-[#F7B541] hidden" />
            </div>
            <div 
               className="text-center"
               style={{
                 fontFamily: '"Dancing Script", sans-serif',
                 fontStyle: 'normal',
                 fontWeight: 500,
                 color: 'rgb(217, 166, 108)',
                 fontSize: '14px',
                 lineHeight: '18px'
               }}
             >
              Event planning and decoration services
            </div>
          </Link>
        </div>
        
        {/* Separator line */}
        <div className="h-px bg-[#D9A66C] w-[90%] mx-auto"></div>
        
        {/* Menu button and WhatsApp contact */}
        <div className="flex justify-between items-center px-4 py-3">
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md bg-[#D9A66C] text-white hover:bg-[#D9A66C]/90 transition-all duration-200 flex items-center justify-center z-[200] relative"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#33373D]" />
              ) : (
                <Menu className="h-6 w-6 text-[#33373D]" />
              )}
            </div>
          </button>
          
          {/* WhatsApp Contact */}
          <a 
            href="https://wa.me/6583392574" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-[#D9A66C] transition-colors duration-200"
          >
            <svg width="24px" height="24px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#D9A66C" stroke="#D9A66C">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
              <g id="SVGRepo_iconCarrier">
                <title>whatsapp [#128]</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7599.000000)" fill="#D9A66C">
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439" id="whatsapp-[#128]"></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <span className="font-medium text-white" style={{fontSize: '17px'}}>+65 8339 2574</span>
          </a>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden absolute inset-x-0 bg-[#d9a66c] shadow-xl z-[100] transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ top: '150px', height: 'fit-content' }} // Position below header
      >
            <div className="w-full py-2">
              <div className="w-full">
                {menuItems.map((item, index) => {
                  const isActive = !item.external && (location.pathname === item.path || (item.label === 'Shop Now' && location.pathname !== '/'))
                  return (
                    <div key={item.path} className="w-full">
                      {item.external ? (
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="relative flex justify-center items-center py-2 font-dosis group transition-colors duration-200 text-gray-800 w-full"
                          style={{fontSize: '17px', lineHeight: '20px', fontWeight: 700}}
                        >
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`relative flex justify-center items-center py-2 font-dosis group transition-colors duration-200 w-full ${
                            isActive
                              ? 'text-white bg-[#543FE0]'
                              : 'text-gray-800'
                          }`}
                          style={{fontSize: '17px', lineHeight: '20px', fontWeight: 700}}
                        >
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </div>
                  )
                })}
                
                {/* Contact button */}
                <div className="w-full">
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative flex justify-center items-center py-2 font-dosis group transition-colors duration-200 text-gray-800 w-full"
                    style={{fontSize: '17px', lineHeight: '20px', fontWeight: 700}}
                  >
                    <span>Contact</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
    </header>
  )
}

export default Header