import React from 'react'
import { motion } from 'framer-motion'
import { CustomerDetails } from '../types'

interface CustomerDetailsFormProps {
  customerDetails: CustomerDetails
  setCustomerDetails: (details: CustomerDetails) => void
  onNext: () => void
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customerDetails,
  setCustomerDetails,
  onNext
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerDetails.name && customerDetails.email && customerDetails.phone && customerDetails.deliveryAddress) {
      onNext()
    }
  }

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails({ ...customerDetails, [field]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 dark:border-gray-700/30"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Customer Details</h2>
      
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Delivery Address *
          </label>
          <textarea
            id="address"
            value={customerDetails.deliveryAddress}
            onChange={(e) => updateField('deliveryAddress', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter your complete delivery address including unit number, city, state, and zip code"
            required
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all"
        >
          Continue to Scheduling
        </motion.button>
      </form>
    </motion.div>
  )
}

export default CustomerDetailsForm