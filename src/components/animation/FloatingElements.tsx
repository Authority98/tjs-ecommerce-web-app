import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FloatingElement {
  icon: LucideIcon
  delay: number
  x: string
  y: string
  duration?: number
  color?: string
}

interface FloatingElementsProps {
  elements: FloatingElement[]
  opacity?: number
  className?: string
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  elements,
  opacity = 0.1,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute dark:opacity-5`}
          style={{ 
            left: element.x, 
            top: element.y,
            opacity: opacity
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: element.duration || 4,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.icon 
            className={`h-16 w-16 ${element.color || 'text-emerald-600'}`} 
          />
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingElements