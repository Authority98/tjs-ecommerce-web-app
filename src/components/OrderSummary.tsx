import React from 'react'
import { OrderSummary, RENTAL_PERIODS, calculateMenPowerCharge, getMenPowerLabel } from '../types'
import { Package, Star, Shield, Clock, Calendar, Wrench, Trash2, Check, Truck, Zap, Building, FileText, Crown, Sparkles } from 'lucide-react'
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
  decorationLevel?: number
  eventSize?: string
  selectedDeliveryAddOns?: string[]
  deliveryConfig?: any
  menPower?: number
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
  isCalculatingTotal = false,
  decorationLevel,
  eventSize,
  selectedDeliveryAddOns = [],
  deliveryConfig,
  menPower
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
        <div className="mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-600/50">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-rose-400 text-center">Order Summary</h3>
        </div>
        
        <div className="space-y-4">
        {/* Product, Gift Card, or Event Service */}
        <div className="relative">
          <div className="flex space-x-4 p-4 border-b border-gray-200/50 dark:border-gray-600/50">
            <div className="relative">
              {orderData.type === 'giftcard' ? (
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-rose-500 to-red-400 rounded-xl shadow-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">🎁</span>
                </div>
              ) : orderData.type === 'event' ? (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-pink-500 to-rose-400 rounded-xl shadow-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">🎉</span>
                </div>
              ) : (
                <img
                  src={orderData.product?.images?.[0] || 'https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={orderData.product?.title || 'Product'}
                  className="w-20 h-20 object-cover rounded-xl shadow-lg"
                />
              )}

            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 dark:text-white line-clamp-2 mb-0.5">
                {orderData.type === 'giftcard' ? '🎄 Twinkle Jingle eGift Card' : 
                 orderData.type === 'event' ? orderData.eventService?.name : 
                 orderData.product?.title}
              </h4>
              {orderData.type === 'event' && orderData.eventService?.category && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {orderData.eventService.category}
                </div>
              )}
              {(orderData.product?.category !== 'trees' || orderData.type === 'event') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {orderData.type === 'giftcard' ? 'Gift Card Value' : 
                     orderData.type === 'event' ? 'Service Price' : 'Price'}
                  </span>
                  <span className="text-xl font-bold text-pink-600 dark:text-rose-400">
                    {orderData.type === 'giftcard' ? `$${orderData.giftCard?.amount || orderData.totalAmount}` : 
                     orderData.type === 'event' ? (
                       orderData.eventService?.priceType === 'fixed' ? `$${orderData.eventService.price}` :
                       orderData.eventService?.priceType === 'from' ? `From $${orderData.eventService.price}` :
                       orderData.eventService?.priceType === 'upon_request' ? 'Price upon request' :
                       'Custom quotation'
                     ) : `$${orderData.product?.price}`}
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
                     </div>
                   </div>
                 )}
            </div>
          </div>
        </div>

        {/* Gift Card Details */}
        {orderData.type === 'giftcard' && orderData.giftCard && (
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <div className="w-2 h-2 rounded-full mr-2 bg-pink-500"></div>
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
        {(additionalCharges.length > 0 || decorationLevel || rentalPeriod || orderData.treeOptions?.rentalPeriod) && (
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center text-sm">
              <Check className="h-3 w-3 text-pink-500 mr-2" />
              Service Charges
            </h4>
            <div className="space-y-1">
              {/* 1. Decoration Level */}
              {decorationLevel && orderData.treeOptions && (
                <div className="flex items-center justify-between py-0.5">
                  <div className="flex items-center">
                    {decorationLevel === 100 ? (
                      <Crown className="w-3 h-3 text-pink-500 mr-1.5" />
                    ) : decorationLevel === 66 ? (
                      <Star className="w-3 h-3 text-pink-500 mr-1.5" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-pink-500 mr-1.5" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {decorationLevel === 100 ? 'Full Decor' : decorationLevel === 66 ? 'Half Decor' : 'Low Decor'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                    {(() => {
                      const charge = calculateMenPowerCharge(menPower || 3);
                      return charge > 0 ? `+$${charge}` : 'Included';
                    })()}
                  </span>
                </div>
              )}

              {/* 3. Rental Period */}
              {(rentalPeriod || orderData.treeOptions?.rentalPeriod) && (
                <div className="flex items-center justify-between py-0.5">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 text-pink-500 mr-1.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Rental Period ({rentalPeriod || orderData.treeOptions?.rentalPeriod} days)</span>
                  </div>
                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                    {(() => {
                      const period = RENTAL_PERIODS.find(p => p.days === (rentalPeriod || orderData.treeOptions?.rentalPeriod));
                      return period && period.additionalCost > 0 ? `+$${period.additionalCost}` : 'Included';
                    })()}
                  </span>
                </div>
              )}
              {/* 4. Men Power */}
              {menPower && orderData.treeOptions && (
                <div className="flex items-center justify-between py-0.5">
                  <div className="flex items-center">
                    <Wrench className="w-3 h-3 text-pink-500 mr-1.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{getMenPowerLabel(menPower)}</span>
                  </div>
                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">Included</span>
                </div>
              )}
              {/* 5. Assembling charges */}
              {additionalCharges.filter(charge => charge.name.toLowerCase().includes('assembling')).map((charge, index) => (
                <div key={`assembling-${index}`} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center">
                    <Wrench className="w-3 h-3 text-pink-500 mr-1.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{charge.name}</span>
                  </div>
                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                    {charge.amount > 0 ? `+$${charge.amount}` : 'Free'}
                  </span>
                </div>
              ))}
              {/* 6. Dismentaling charges */}
              {additionalCharges.filter(charge => charge.name.toLowerCase().includes('dismentaling')).map((charge, index) => (
                <div key={`dismentaling-${index}`} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center">
                    <Trash2 className="w-3 h-3 text-pink-500 mr-1.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{charge.name}</span>
                  </div>
                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                    {charge.amount > 0 ? `+$${charge.amount}` : 'Free'}
                  </span>
                </div>
              ))}
              {/* 7. Delivery Add-ons - Minimal compact design */}
              {selectedDeliveryAddOns && deliveryConfig && selectedDeliveryAddOns.length > 0 && (
                <div className="flex flex-wrap gap-1 py-0.5">
                  {selectedDeliveryAddOns.map((addOnId) => {
                    const addOn = deliveryConfig.addOns?.find((a: any) => a.id === addOnId && a.enabled)
                    if (!addOn) return null
                    
                    return (
                      <div key={addOnId} className="inline-flex items-center bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded text-xs">
                        <span className="text-gray-700 dark:text-gray-300 mr-1">{addOn.name}</span>
                        <span className="text-pink-600 dark:text-pink-400 font-medium">+${addOn.fee}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              {/* 8. Delivery section - only show if delivery charge exists */}
              {additionalCharges.find(charge => charge.name === 'Delivery') && (
                <div className="flex items-center justify-between py-0.5">
                  <div className="flex items-center">
                    <Truck className="w-3 h-3 text-pink-500 mr-1.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {orderData.product?.category === 'trees' ? 'Two Way Trip' : 'Delivery'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">+${additionalCharges.find(charge => charge.name === 'Delivery')?.amount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total - only show from delivery section onwards (step 2+) */}
        {currentStep >= 2 && (
          <div className="pt-4 mt-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-gray-600 dark:text-gray-400 text-sm">Total Amount</div>
                {orderData.product?.category === 'trees' && (
                  <div className="text-xs bg-amber-100/50 dark:bg-amber-900/30 px-2 py-1 rounded text-amber-700 dark:text-amber-300">
                     Final price upon order
                   </div>
                )}
              </div>
              {isCalculatingTotal ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-rose-400">$</span>
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-rose-400">${finalTotal}</div>
              )}
            </div>
          </div>
        )}

        {/* Discount Code Input - Only show for products, not gift cards - Moved below total and made minimal */}
         {orderData.type !== 'giftcard' && (
           <div className="mt-4 pt-4">
             <DiscountCodeInput
               orderData={orderData}
               appliedDiscount={appliedDiscount}
               onDiscountApplied={onDiscountApplied}
             />
           </div>
         )}
        
        </div>
    </div>
  )
}

export default OrderSummaryComponent