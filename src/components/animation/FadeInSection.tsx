import React from 'react'

interface FadeInSectionProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string

}

const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = '',

}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 20 }
      case 'down': return { opacity: 0, y: -20 }
      case 'left': return { opacity: 0, x: -20 }
      case 'right': return { opacity: 0, x: 20 }
      case 'none': return { opacity: 0 }
      default: return { opacity: 0, y: 20 }
    }
  }

  const getAnimatePosition = () => {
    switch (direction) {
      case 'up': return { opacity: 1, y: 0 }
      case 'down': return { opacity: 1, y: 0 }
      case 'left': return { opacity: 1, x: 0 }
      case 'right': return { opacity: 1, x: 0 }
      case 'none': return { opacity: 1 }
      default: return { opacity: 1, y: 0 }
    }
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default FadeInSection