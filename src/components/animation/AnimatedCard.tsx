import React from 'react'
import Card from '../ui/Card'

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  hoverScale?: number
  hoverY?: number
  className?: string
  variant?: 'default' | 'glass' | 'solid' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'

}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  hoverScale = 1.02,
  hoverY = -4,
  className = '',
  variant = 'default',
  padding = 'md',

}) => {
  return (
    <div className={className}>
      <Card
        variant={variant}
        padding={padding}
        className="h-full"
      >
        {children}
      </Card>
    </div>
  )
}

export default AnimatedCard