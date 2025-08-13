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
    
    // Add delivery charge for products (not gift cards)
    // Note: Assembling/dismantling charges are now dynamic and calculated in CheckoutPage
    if (orderData.type !== 'giftcard') {
      total += 20 // Delivery (using default for discount calculation)
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
      <div className="rounded-lg p-2.5 border bg-gradient-to-r from-green-50/50 via-emerald-50/30 to-teal-50/20 dark:from-green-950/10 dark:via-emerald-950/8 dark:to-teal-950/5 border-green-200/30 dark:border-green-700/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full mr-2 bg-green-500" />
            <div>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                Discount Applied
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Code: <span className="font-mono font-semibold">{appliedDiscount.code}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              -${appliedDiscount.amount.toFixed(2)}
            </span>
            <button
              onClick={removeDiscount}
              className="p-0.5 text-red-500 hover:bg-red-100 rounded-full transition-colors"
              title="Remove discount"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg p-3 border bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/20 dark:from-blue-950/10 dark:via-indigo-950/8 dark:to-purple-950/5 border-blue-200/30 dark:border-blue-700/20">
      <div className="flex items-center mb-2">
        <Tag className="w-3 h-3 mr-1.5 text-blue-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount Code</span>
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && validateAndApplyDiscount()}
          placeholder="Enter code"
          className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs font-mono"
          disabled={loading}
        />
        <button
          onClick={validateAndApplyDiscount}
          disabled={loading || !code.trim()}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md text-xs font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={12} />
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}

export default DiscountCodeInput