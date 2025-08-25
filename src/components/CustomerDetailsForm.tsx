import React, { useEffect } from 'react'
import { CustomerDetails, DeliveryConfiguration } from '../types'
import ZoneSelector from './ZoneSelector'
import { Zap, Building, FileText, Check } from 'lucide-react'

interface CustomerDetailsFormProps {
  customerDetails: CustomerDetails
  setCustomerDetails: (details: CustomerDetails) => void
  onNext: () => void
  onBack?: () => void
  nextButtonText?: string
  isGiftCard?: boolean
  deliveryConfig?: DeliveryConfiguration | null
  selectedDeliveryAddOns: string[]
  setSelectedDeliveryAddOns: (addOns: string[]) => void
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customerDetails,
  setCustomerDetails,
  onNext,
  onBack,
  nextButtonText = 'Continue to Scheduling',
  isGiftCard = false,
  deliveryConfig,
  selectedDeliveryAddOns,
  setSelectedDeliveryAddOns
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = isGiftCard || (customerDetails.deliveryZone && customerDetails.unitNumber && customerDetails.buildingName && customerDetails.streetAddress)
    if (isValid) {
      onNext()
    }
  }

  const handleZoneChange = (zone: string, area: string, postalCode: string, fee: number) => {
    setCustomerDetails({
      ...customerDetails,
      postalCode: '', // No postal code needed for zone-based delivery
      deliveryZone: zone,
      deliveryArea: area,
      deliveryFee: fee
    })
  }

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails({
      ...customerDetails,
      [field]: value
    })
  }

  // Handle delivery add-on selection
  const handleDeliveryAddOnToggle = (addOnId: string) => {
    if (selectedDeliveryAddOns.includes(addOnId)) {
      setSelectedDeliveryAddOns(selectedDeliveryAddOns.filter(id => id !== addOnId))
    } else {
      setSelectedDeliveryAddOns([...selectedDeliveryAddOns, addOnId])
    }
  }

  // Get icon for delivery add-on
  const getAddOnIcon = (addOnId: string) => {
    switch (addOnId) {
      case 'rush-order':
        return <Zap className="w-3 h-3 text-pink-500" />
      case 'no-lift':
        return <Building className="w-3 h-3 text-pink-500" />
      case 'permits':
        return <FileText className="w-3 h-3 text-pink-500" />
      default:
        return <FileText className="w-3 h-3 text-pink-500" />
    }
  }

  // Update delivery address when Singapore address fields change
  useEffect(() => {
    if (customerDetails.postalCode || customerDetails.unitNumber || customerDetails.buildingName || customerDetails.streetAddress) {
      const fullAddress = `${customerDetails.unitNumber ? customerDetails.unitNumber + ' ' : ''}${customerDetails.buildingName ? customerDetails.buildingName + ', ' : ''}${customerDetails.streetAddress || ''}, Singapore ${customerDetails.postalCode || ''}`.trim()
      if (fullAddress !== customerDetails.deliveryAddress) {
        updateField('deliveryAddress', fullAddress)
      }
    }
  }, [customerDetails.postalCode, customerDetails.unitNumber, customerDetails.buildingName, customerDetails.streetAddress])

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/15 dark:to-orange-950/15 rounded-3xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30 relative z-10">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full blur-xl z-0 opacity-40"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full blur-lg z-0 opacity-40"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis relative z-10">Delivery</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-20">


        {!isGiftCard && (
          <div className="space-y-4">
            {/* Zone Selection */}
            <ZoneSelector
              deliveryConfig={deliveryConfig}
              selectedZone={customerDetails.deliveryZone}
              selectedArea={customerDetails.deliveryArea}
              onZoneChange={handleZoneChange}
              className="mb-6"
            />
            
            {/* Postal Code, Unit Number, Building Name - 3 Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={customerDetails.postalCode || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '') // Only allow numbers
                    updateField('postalCode', value)
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent relative z-30 text-sm"
                  style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                  placeholder="018956 (optional)"
                  maxLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unit Number *
                </label>
                <input
                  type="text"
                  id="unitNumber"
                  value={customerDetails.unitNumber || ''}
                  onChange={(e) => {
                    updateField('unitNumber', e.target.value)
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent relative z-30 text-sm"
                  style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                  placeholder="#12-34"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Building/Estate Name *
                </label>
                <input
                  type="text"
                  id="buildingName"
                  value={customerDetails.buildingName || ''}
                  onChange={(e) => {
                    updateField('buildingName', e.target.value)
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent relative z-30 text-sm"
                  style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                  placeholder="Marina Bay Residences"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="streetAddress"
                value={customerDetails.streetAddress || ''}
                onChange={(e) => {
                  updateField('streetAddress', e.target.value)
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 relative z-30 text-sm"
                style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                placeholder="18 Marina Gardens Drive"
                required
              />
            </div>
            
            {/* Delivery Add-ons Section */}
            {deliveryConfig && deliveryConfig.addOns && deliveryConfig.addOns.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {deliveryConfig.addOns
                    .filter(addOn => addOn.enabled)
                    .map((addOn) => {
                      const isSelected = selectedDeliveryAddOns.includes(addOn.id)
                      return (
                        <button
                          key={addOn.id}
                          type="button"
                          onClick={() => handleDeliveryAddOnToggle(addOn.id)}
                          className={`p-2 rounded-lg border text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20'
                              : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {getAddOnIcon(addOn.id)}
                              <div>
                                <span className="text-sm font-medium text-gray-800 dark:text-white block">
                                  {addOn.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                +${addOn.fee}
                              </span>
                              {isSelected && (
                                <Check className="h-3 w-3 text-amber-500" />
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

          </div>
        )}

        <div className="flex gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
            >
              Back to Scheduling
            </button>
          )}
          <button
            type="submit"
            className={`${onBack ? 'flex-1' : 'w-full'} py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-300`}
          >
            {nextButtonText}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CustomerDetailsForm