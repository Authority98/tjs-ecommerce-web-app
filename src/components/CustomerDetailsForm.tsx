import React from 'react'
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
    const isValid = customerDetails.name && customerDetails.email && customerDetails.phone && (isGiftCard || customerDetails.deliveryAddress)
    if (isValid) {
      onNext()
    }
  }

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails({ ...customerDetails, [field]: value })
  }

  return (
    <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 dark:border-gray-700/30">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis">Customer Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={customerDetails.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-purple-400/30 bg-white dark:bg-purple-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 dark:border-purple-400/30 bg-white dark:bg-purple-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 dark:border-purple-400/30 bg-white dark:bg-purple-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {!isGiftCard && (
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Delivery Address *
            </label>
            <textarea
              id="address"
              value={customerDetails.deliveryAddress}
              onChange={(e) => updateField('deliveryAddress', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-purple-400/30 bg-white dark:bg-purple-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your complete delivery address including unit number, city, state, and zip code"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-xl"
        >
          {nextButtonText}
        </button>
      </form>
    </div>
  )
}

export default CustomerDetailsForm