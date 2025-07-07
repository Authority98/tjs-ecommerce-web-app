import React from 'react'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'outlined' | 'filled'
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

  const getVariantClasses = () => {
    const baseClasses = 'w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B541]'
    
    switch (variant) {
      case 'outlined':
        return `${baseClasses} border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-[#F7B541]`
      case 'filled':
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 border-0 focus:bg-white dark:focus:bg-gray-600`
      default:
        return `${baseClasses} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-[#F7B541]`
    }
  }

  const inputClasses = getVariantClasses()
  const hasIcon = !!Icon
  const iconPadding = hasIcon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          id={inputId}
          className={`${inputClasses} ${iconPadding} ${className} ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Input