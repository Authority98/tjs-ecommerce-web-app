import React, { useState, useEffect } from 'react'

import { TreePine, Star } from 'lucide-react'

const LoadingSpinner: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  
  const messages = [
    'Decorating your Christmas tree...',
    'Sprinkling festive magic...',
    'Preparing holiday surprises...',
    'Adding finishing touches...',
    'Almost ready for Christmas!'
  ]

  const colors = {
    primary: ['#10B981', '#059669', '#047857'], // Green shades
    accent: ['#F59E0B', '#D97706', '#B45309'], // Gold shades
    magical: ['#8B5CF6', '#7C3AED', '#6D28D9'] // Purple shades
  }

  useEffect(() => {
    // Generate fewer, simpler particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length)
    }, 1500)

    return () => clearInterval(messageInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-purple-50 via-fuchsia-50 to-violet-100 dark:from-purple-900 dark:via-fuchsia-900 dark:to-violet-800 overflow-hidden">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-50" />
        </div>
      ))}

      {/* Main Content */}
      <div className="text-center relative z-10">
        {/* Animated Christmas Tree */}
        <div className="mb-8 relative">
          <div className="relative">
            <img
              src="/assets/images/logo.webp"
              alt="Twinkle Jingle Logo"
              className="w-40 h-40 mx-auto object-contain"
              onError={(e) => {
                // Fallback to TreePine icon if logo fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'block'
              }}
            />
            {/* Fallback icon (hidden by default) */}
            <TreePine className="w-24 h-24 mx-auto text-purple-600 dark:text-purple-400 hidden" />
            
            {/* Simple star on top */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </div>
        </div>

        {/* Three Dot Loading */}
        <div className="flex justify-center space-x-2 mb-8 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full"
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default LoadingSpinner