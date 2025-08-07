import React, { useEffect } from 'react'
import { CustomerDetails } from '../types'

interface CustomerDetailsFormProps {
  customerDetails: CustomerDetails
  setCustomerDetails: (details: CustomerDetails) => void
  onNext: () => void
  nextButtonText?: string
  isGiftCard?: boolean
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customerDetails,
  setCustomerDetails,
  onNext,
  nextButtonText = 'Continue to Scheduling',
  isGiftCard = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = customerDetails.name && customerDetails.email && customerDetails.phone && 
      (isGiftCard || (customerDetails.postalCode && customerDetails.streetAddress))
    if (isValid) {
      onNext()
    }
  }

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails({
      ...customerDetails,
      [field]: value
    })
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
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis relative z-10">Customer Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={customerDetails.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={customerDetails.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={customerDetails.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="+65 XXXX XXXX"
            required
          />
        </div>

        {!isGiftCard && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delivery Address (Singapore Only)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={customerDetails.postalCode || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    updateField('postalCode', value)
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent relative z-30"
                  style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                  placeholder="Enter postal code"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter your postal code</p>
              </div>
              
              <div>
                <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unit Number
                </label>
                <input
                  type="text"
                  id="unitNumber"
                  value={customerDetails.unitNumber || ''}
                  onChange={(e) => {
                    updateField('unitNumber', e.target.value)
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent relative z-30"
                  style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                  placeholder="#12-34"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Building/Estate Name
              </label>
              <input
                type="text"
                id="buildingName"
                value={customerDetails.buildingName || ''}
                onChange={(e) => {
                  updateField('buildingName', e.target.value)
                }}
                className="w-full p-3 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent relative z-30"
                style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                placeholder="Marina Bay Residences"
              />
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
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 relative z-30"
                style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                placeholder="18 Marina Gardens Drive"
                required
              />
            </div>
            

          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-300"
        >
          {nextButtonText}
        </button>
      </form>
    </div>
  )
}

export default CustomerDetailsForm