import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-50" />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="text-center relative z-10">
        {/* Animated Christmas Tree */}
        <div className="mb-8 relative">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
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
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </motion.div>
          </motion.div>
        </div>

        {/* Three Dot Loading */}
        <div className="flex justify-center space-x-2 mb-8 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default LoadingSpinner