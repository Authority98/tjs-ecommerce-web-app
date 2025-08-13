import React from 'react'
import { OrderSummary, RENTAL_PERIODS } from '../types'
import { Package, Star, Shield, Clock } from 'lucide-react'
import DiscountCodeInput from './DiscountCodeInput'

interface OrderSummaryProps {
  orderData: OrderSummary | any // Allow gift card data structure
  rushOrder: boolean
  finalTotal: number
  rentalPeriod?: number
  currentStep?: number
  additionalCharges?: Array<{ name: string; amount: number }>
  deliveryError?: string
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
  isCalculatingTotal?: boolean
}

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({
  orderData,
  rushOrder,
  finalTotal,
  rentalPeriod,
  currentStep = 1,
  additionalCharges = [],
  deliveryError,
  appliedDiscount,
  onDiscountApplied,
  isCalculatingTotal = false
}) => {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-3xl shadow-xl p-4 sticky top-24 border border-white/20 dark:border-gray-700/30 relative">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 via-rose-400 to-red-300 rounded-full blur-xl z-0 opacity-40"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 via-rose-400 to-red-300 rounded-full blur-lg z-0 opacity-40"></div>
      </div>
      
      {/* Main white content area */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
            <Package className="h-6 w-6 text-pink-600 dark:text-rose-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-dosis">Order Summary</h3>
        </div>
        
        <div className="space-y-4">
        {/* Product or Gift Card */}
        <div className="relative">
          <div className="flex space-x-4 p-4 border-b border-gray-200/50 dark:border-gray-600/50">
            <div className="relative">
              {orderData.type === 'giftcard' ? (
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-rose-500 to-red-400 rounded-xl shadow-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">🎁</span>
                </div>
              ) : (
                <img
                  src={orderData.product?.images?.[0] || 'https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={orderData.product?.title || 'Product'}
                  className="w-20 h-20 object-cover rounded-xl shadow-lg"
                />
              )}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-pink-500">
                  <Star className="h-3 w-3 text-white" />
                </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 dark:text-white line-clamp-2 mb-0.5">
                {orderData.type === 'giftcard' ? '🎄 Twinkle Jingle eGift Card' : orderData.product?.title}
              </h4>
              {orderData.product?.category !== 'trees' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {orderData.type === 'giftcard' ? 'Gift Card Value' : 'Price'}
                  </span>
                  <span className="text-xl font-bold text-pink-600 dark:text-rose-400">
                    {orderData.type === 'giftcard' ? `$${orderData.giftCard?.amount || orderData.totalAmount}` : `$${orderData.product?.price}`}
                  </span>
                </div>
              )}
               
               {/* Tree Customizations - Merged into product div, single line */}
                 {orderData.treeOptions && (
                   <div className="mt-1.5 pt-1.5 border-t border-gray-200/30 dark:border-gray-600/30">
                     <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customizations</div>
                     <div className="flex flex-wrap gap-1 text-xs">
                       {orderData.treeOptions.height && (
                         <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                           {orderData.treeOptions.height}
                         </span>
                       )}
                       <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                         {orderData.treeOptions.type}
                       </span>
                       <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                         {orderData.treeOptions.decorLevel}% decor
                       </span>
                     </div>
                   </div>
                 )}
            </div>
          </div>
        </div>

        {/* Gift Card Details */}
        {orderData.type === 'giftcard' && orderData.giftCard && (
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
              <div className="w-2 h-2 rounded-full mr-2 bg-pink-500" />
              Gift Card Details
            </h4>
            <div className="space-y-3 text-sm">
              {!orderData.giftCard.isForSelf && orderData.giftCard.recipientName && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Recipient</div>
                  <div className="font-medium text-gray-800 dark:text-white">{orderData.giftCard.recipientName}</div>
                  {orderData.giftCard.recipientEmail && (
                    <div className="text-gray-600 dark:text-gray-300 text-xs">{orderData.giftCard.recipientEmail}</div>
                  )}
                </div>
              )}
              {orderData.giftCard.senderName && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">From</div>
                  <div className="font-medium text-gray-800 dark:text-white">{orderData.giftCard.senderName}</div>
                </div>
              )}
              {orderData.giftCard.personalMessage && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Personal Message</div>
                  <div className="font-medium text-gray-800 dark:text-white italic">"{orderData.giftCard.personalMessage}"</div>
                </div>
              )}
              {orderData.giftCard.deliveryDate && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Delivery</div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {orderData.giftCard.deliveryDate === 'now' ? 'Immediate Delivery' : `Scheduled for ${orderData.giftCard.scheduledDate}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tree Options section removed - merged into product div above */}

        {/* Service & Delivery Charges */}
        {additionalCharges.length > 0 && (
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
              <div className="w-2 h-2 rounded-full mr-2 bg-pink-500" />
              Service Charges
            </h4>
            <div className="space-y-2">
              {additionalCharges.filter(charge => charge.name !== 'Delivery').map((charge, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{charge.name}</span>
                  <span className="text-sm font-semibold text-pink-600 dark:text-rose-400">+${charge.amount}</span>
                </div>
              ))}
              {/* Rental Period */}
              {currentStep >= 2 && (rentalPeriod || orderData.treeOptions?.rentalPeriod) && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Rental Period ({rentalPeriod || orderData.treeOptions?.rentalPeriod} days)</span>
                  <span className="text-sm font-semibold text-pink-600 dark:text-rose-400">
                      {(() => {
                        const period = RENTAL_PERIODS.find(p => p.days === (rentalPeriod || orderData.treeOptions?.rentalPeriod));
                        return period && period.additionalCost > 0 ? `+$${period.additionalCost}` : 'Included';
                      })()}
                    </span>
                </div>
              )}
              {/* Rush Order */}
              {rushOrder && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Rush Order</span>
                  <span className="text-sm font-semibold text-pink-600 dark:text-rose-400">+$150</span>
                </div>
              )}
              {/* Delivery section - always visible */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Delivery</span>
                {additionalCharges.find(charge => charge.name === 'Delivery') ? (
                  <span className="text-sm font-semibold text-pink-600 dark:text-rose-400">+${additionalCharges.find(charge => charge.name === 'Delivery')?.amount}</span>
                ) : (
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}



         {/* Total */}
        <div className="border-t-2 border-pink-200 dark:border-pink-700 pt-4 mt-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-gray-600 dark:text-gray-400 text-sm">Total Amount</div>
              {orderData.product?.category === 'trees' && (
                <div className="text-xs bg-amber-100/50 dark:bg-amber-900/30 px-2 py-1 rounded-lg text-amber-800 dark:text-amber-200 font-medium italic border border-amber-200/50 dark:border-amber-700/30">
                   Final price upon order
                 </div>
              )}
            </div>
            {isCalculatingTotal ? (
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">$</span>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            ) : (
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">${finalTotal}</div>
            )}
          </div>
        </div>

        {/* Discount Code Input - Only show for products, not gift cards - Moved below total and made minimal */}
         {orderData.type !== 'giftcard' && (
           <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-600/50">
             <DiscountCodeInput
               orderData={orderData}
               appliedDiscount={appliedDiscount}
               onDiscountApplied={onDiscountApplied}
             />
           </div>
         )}
        

      </div>
    </div>
    </div>
  )
}

export default OrderSummaryComponent