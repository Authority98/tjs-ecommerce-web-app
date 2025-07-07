import React from 'react'
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
        <div
          key={index}
          className={`absolute dark:opacity-5`}
          style={{ 
            left: element.x, 
            top: element.y,
            opacity: opacity
          }}
        >
          <element.icon 
            className={`h-16 w-16 ${element.color || 'text-emerald-600'}`} 
          />
        </div>
      ))}
    </div>
  )
}

export default FloatingElements