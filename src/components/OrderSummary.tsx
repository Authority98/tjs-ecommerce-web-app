import React from 'react'
import { motion } from 'framer-motion'
import { OrderSummary, RENTAL_PERIODS } from '../types'
import { Package, Star, Shield, Clock } from 'lucide-react'

interface OrderSummaryProps {
  orderData: OrderSummary
  rushOrder: boolean
  finalTotal: number
}

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({
  orderData,
  rushOrder,
  finalTotal
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 p-8 sticky top-24 border border-white/30 dark:border-gray-700/30"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <Package className="h-6 w-6 text-purple-600 dark:text-amber-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-dosis">Order Summary</h3>
      </div>
      
      <div className="space-y-6">
        {/* Product */}
        <div className="relative">
          <div className="flex space-x-4 p-4 bg-white/60 dark:bg-purple-950/20 rounded-2xl border border-white/40 dark:border-gray-700/30">
            <div className="relative">
              <img
                src={orderData.product.images[0] || 'https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt={orderData.product.title}
                className="w-20 h-20 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#9333E9'}}>
                <Star className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 dark:text-white line-clamp-2 mb-2">
                {orderData.product.title}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Base Price</span>
                <span className="text-xl font-bold" style={{color: '#9333E9'}}>
                  ${orderData.product.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tree Options */}
        {orderData.treeOptions && (
          <div className="rounded-2xl p-4 border" style={{background: 'linear-gradient(to right, rgba(147, 51, 233, 0.08), rgba(147, 51, 233, 0.12))', borderColor: 'rgba(147, 51, 233, 0.3)'}}>
            <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: '#9333E9'}} />
              Customizations
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {orderData.treeOptions.height && (
                <div className="bg-white/60 dark:bg-purple-950/20 rounded-lg p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Size</div>
                  <div className="font-medium text-gray-800 dark:text-white">{orderData.treeOptions.height}</div>
                </div>
              )}
              <div className="bg-white/60 dark:bg-purple-950/20 rounded-lg p-2">
                <div className="text-gray-500 dark:text-gray-400 text-xs">Type</div>
                <div className="font-medium text-gray-800 dark:text-white">{orderData.treeOptions.type}</div>
              </div>
              <div className="bg-white/60 dark:bg-purple-950/20 rounded-lg p-2">
                <div className="text-gray-500 dark:text-gray-400 text-xs">Rental</div>
                <div className="font-medium text-gray-800 dark:text-white">
                  {orderData.treeOptions.rentalPeriod} days
                  {(() => {
                    const rentalPeriod = RENTAL_PERIODS.find(p => p.days === orderData.treeOptions.rentalPeriod);
                    const additionalCost = rentalPeriod?.additionalCost || 0;
                    return additionalCost > 0 ? ` (+$${additionalCost})` : '';
                  })()}
                </div>
              </div>
              <div className="bg-white/60 dark:bg-purple-950/20 rounded-lg p-2">
                <div className="text-gray-500 dark:text-gray-400 text-xs">Decor</div>
                <div className="font-medium text-gray-800 dark:text-white">{orderData.treeOptions.decorLevel}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Add-ons */}
        {rushOrder && (
          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-4 border border-amber-200/50 dark:border-amber-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-gray-800 dark:text-white">Rush Order</span>
              </div>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">+$150</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Priority scheduling within 48 hours</div>
          </div>
        )}

        {/* Total */}
        <div className="rounded-2xl p-6 text-white shadow-xl" style={{background: 'linear-gradient(to right, #9333E9, #7C3AED)'}}>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-amber-100 text-sm">Total Amount</div>
              <div className="text-3xl font-bold">${finalTotal}</div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Package className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-600/50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
              <Shield className="h-3 w-3 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-medium">Secure Checkout</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Star className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium">Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default OrderSummaryComponent