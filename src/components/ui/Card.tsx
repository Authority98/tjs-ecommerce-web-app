import React from 'react'
import { motion, MotionProps } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'solid' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  motionProps?: MotionProps
  hover?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  motionProps,
  hover = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30'
      case 'solid':
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      case 'outlined':
        return 'border-2 border-gray-200 dark:border-gray-700 bg-transparent'
      default:
        return 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30'
    }
  }

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return ''
      case 'sm':
        return 'p-4'
      case 'md':
        return 'p-6'
      case 'lg':
        return 'p-8'
      default:
        return 'p-6'
    }
  }

  const baseClasses = 'rounded-2xl shadow-lg'
  const variantClasses = getVariantClasses()
  const paddingClasses = getPaddingClasses()
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-200' : ''

  const finalClassName = `${baseClasses} ${variantClasses} ${paddingClasses} ${hoverClasses} ${className}`

  if (motionProps) {
    return (
      <motion.div
        className={finalClassName}
        {...motionProps}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={finalClassName}>
      {children}
    </div>
  )
}

export default Card