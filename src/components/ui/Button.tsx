import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  motionProps?: MotionProps
  gradient?: string
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  motionProps,
  gradient,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return gradient 
          ? `bg-gradient-to-r ${gradient} text-white`
          : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-600 hover:to-fuchsia-600 hover:shadow-purple-400/50 hover:scale-105'
      case 'secondary':
        return 'bg-white dark:bg-purple-900/20 text-purple-600 dark:text-amber-400 border-2 border-purple-600 dark:border-amber-400 hover:bg-purple-50 dark:hover:bg-purple-800/30 hover:shadow-purple-300/40'
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
      case 'ghost':
        return 'text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-700 dark:hover:text-amber-400'
      default:
        return 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-600 hover:to-fuchsia-600 hover:shadow-purple-400/50 hover:scale-105'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()
  const shadowClasses = variant === 'primary' || variant === 'danger' ? 'shadow-lg hover:shadow-xl' : 'shadow-sm'

  const buttonContent = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      )}
    </>
  )

  const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${shadowClasses} ${className}`

  if (motionProps) {
    return (
      <motion.button
        className={finalClassName}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0 }}
        {...motionProps}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </button>
  )
}

export default Button