import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import Card from '../ui/Card'

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  hoverScale?: number
  hoverY?: number
  className?: string
  variant?: 'default' | 'glass' | 'solid' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  motionProps?: MotionProps
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  hoverScale = 1.02,
  hoverY = -4,
  className = '',
  variant = 'default',
  padding = 'md',
  motionProps
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ 
        scale: hoverScale, 
        y: hoverY,
        transition: { duration: 0 }
      }}
      className={className}
      {...motionProps}
    >
      <Card
        variant={variant}
        padding={padding}
        className="h-full transition-shadow duration-300 hover:shadow-xl"
      >
        {children}
      </Card>
    </motion.div>
  )
}

export default AnimatedCard