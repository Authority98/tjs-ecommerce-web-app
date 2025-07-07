import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean

  gradient?: string
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  iconPosition = 'left',
  loading = false,

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
          : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white'
      case 'secondary':
        return 'bg-white dark:bg-purple-900/20 text-purple-600 dark:text-amber-400 border-2 border-purple-600 dark:border-amber-400'
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      case 'ghost':
        return 'text-purple-600 dark:text-purple-300'
      default:
        return 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white'
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

  const baseClasses = 'font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()
  const shadowClasses = variant === 'primary' || variant === 'danger' ? 'shadow-lg' : 'shadow-sm'

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