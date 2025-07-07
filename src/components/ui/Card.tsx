import React from 'react'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'solid' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string

  hover?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',

  hover = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 bg-opacity-95'
      case 'solid':
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      case 'outlined':
        return 'border-2 border-gray-200 dark:border-gray-700 bg-transparent'
      default:
        return 'bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 bg-opacity-95'
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

  const baseClasses = 'rounded-3xl shadow-xl'
  const variantClasses = getVariantClasses()
  const paddingClasses = getPaddingClasses()
  const hoverClasses = ''

  const finalClassName = `${baseClasses} ${variantClasses} ${paddingClasses} ${hoverClasses} ${className}`



  return (
    <div className={finalClassName}>
      {children}
    </div>
  )
}

export default Card