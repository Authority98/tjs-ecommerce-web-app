import React from 'react'
import { AlertCircle, Clock } from 'lucide-react'

interface PriceBadgeProps {
  price: number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
  isPreOrder?: boolean
  treeType?: string
}

const PriceBadge: React.FC<PriceBadgeProps> = ({ price, size = 'md', className = '', isPreOrder = false, treeType = '' }) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const isLiveTreePreOrder = treeType && ['Noble Fir', 'Nordmann Fir', 'Fraser Fir'].includes(treeType) && price === null
  const showPreOrder = isPreOrder || isLiveTreePreOrder

  if (showPreOrder) {
    return (
      <div className={`flex items-center gap-1 text-amber-500 dark:text-amber-400 ${sizeClasses[size]} font-normal ${className}`}>
        <Clock className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}`} />
        <span>Pre-Order</span>
      </div>
    )
  }

  if (price === null || price === 0) {
    return (
      <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 ${sizeClasses[size]} font-normal ${className}`}>
        <AlertCircle className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}`} />
        <span>Price TBD</span>
      </div>
    )
  }

  return (
    <span className={`font-medium text-pink-600 dark:text-rose-400 ${sizeClasses[size]} ${className}`}>
      ${price}
    </span>
  )
}

export default PriceBadge