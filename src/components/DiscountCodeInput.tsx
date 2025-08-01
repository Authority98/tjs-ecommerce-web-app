import React, { useState } from 'react'
import { Tag, Check, X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { OrderSummary } from '../types'

interface DiscountCodeInputProps {
  orderData: OrderSummary
  appliedDiscount?: {
    id: string
    code: string
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    amount: number
  } | null
  onDiscountApplied?: (discount: {
    id: string
    code: string
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    amount: number
  } | null) => void
}

const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
  orderData,
  appliedDiscount,
  onDiscountApplied
}) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Calculate order total including additional charges but excluding rush order
  const calculateOrderTotal = () => {
    let total = orderData.totalAmount
    
    // Add additional charges for products (not gift cards)
    if (orderData.type !== 'giftcard') {
      total += 10 // Assembling
      total += 10 // Dismantling
      total += 20 // Delivery
    }
    
    return total
  }

  const validateAndApplyDiscount = async () => {
    if (!code.trim()) {
      setError('Please enter a discount code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Fetch the discount code from database
      const { data: discountCode, error: fetchError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_active', true)
        .single()

      if (fetchError || !discountCode) {
        setError('Invalid or expired discount code')
        return
      }

      // Check if code is still valid (dates)
      const now = new Date()
      if (discountCode.valid_from && new Date(discountCode.valid_from) > now) {
        setError('This discount code is not yet active')
        return
      }
      if (discountCode.valid_until && new Date(discountCode.valid_until) < now) {
        setError('This discount code has expired')
        return
      }

      const orderTotal = calculateOrderTotal()

      // Check minimum order amount
      if (discountCode.min_order_amount && orderTotal < discountCode.min_order_amount) {
        setError(`Minimum order amount of $${discountCode.min_order_amount} required`)
        return
      }

      // Check usage limits
      if (discountCode.max_uses && discountCode.used_count >= discountCode.max_uses) {
        setError('This discount code has reached its usage limit')
        return
      }

      // Calculate discount amount
      let discountAmount = 0
      if (discountCode.discount_type === 'percentage') {
        discountAmount = (orderTotal * discountCode.discount_value) / 100
      } else {
        discountAmount = discountCode.discount_value
      }

      // Ensure discount doesn't exceed order total
      discountAmount = Math.min(discountAmount, orderTotal)

      // Apply the discount
      if (onDiscountApplied) {
        onDiscountApplied({
          id: discountCode.id,
          code: discountCode.code,
          discount_type: discountCode.discount_type,
          discount_value: discountCode.discount_value,
          amount: discountAmount
        })
      }

      setCode('')
    } catch (error) {
      console.error('Error applying discount:', error)
      setError('Failed to apply discount code')
    } finally {
      setLoading(false)
    }
  }

  const removeDiscount = () => {
    if (onDiscountApplied) {
      onDiscountApplied(null)
    }
    setError('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndApplyDiscount()
    }
  }

  if (appliedDiscount) {
    return (
      <div className="rounded-2xl p-4 border bg-gradient-to-r from-green-100/80 via-emerald-100/60 to-teal-100/40 dark:from-green-950/20 dark:via-emerald-950/15 dark:to-teal-950/10 border-green-200/50 dark:border-green-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white">
                Discount Applied
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Code: <span className="font-mono font-semibold">{appliedDiscount.code}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              -${appliedDiscount.amount.toFixed(2)}
            </span>
            <button
              onClick={removeDiscount}
              className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
              title="Remove discount"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 border bg-gradient-to-r from-blue-100/80 via-indigo-100/60 to-purple-100/40 dark:from-blue-950/20 dark:via-indigo-950/15 dark:to-purple-950/10 border-blue-200/50 dark:border-blue-700/30">
      <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
        <Tag className="w-4 h-4 mr-2 text-blue-500" />
        Discount Code
      </h4>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && validateAndApplyDiscount()}
          placeholder="Enter discount code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
          disabled={loading}
        />
        <button
          onClick={validateAndApplyDiscount}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={16} />
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Enter a valid discount code to save on your order
      </p>
    </div>
  )
}

export default DiscountCodeInput