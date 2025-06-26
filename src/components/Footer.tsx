import React from 'react'


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-purple-50 to-violet-100 border-t border-gray-200/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm font-manrope">
            © {currentYear} TJS Christmas Tree Rental. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer