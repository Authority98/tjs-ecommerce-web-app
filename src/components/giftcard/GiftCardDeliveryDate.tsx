import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Send } from 'lucide-react'

interface GiftCardDeliveryDateProps {
  deliveryDate: string
  scheduledDate?: string
  onDeliveryDateChange: (date: string) => void
  onScheduledDateChange?: (date: string) => void
}

const GiftCardDeliveryDate: React.FC<GiftCardDeliveryDateProps> = ({
  deliveryDate,
  scheduledDate,
  onDeliveryDateChange,
  onScheduledDateChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="deliveryDate"
            value="now"
            checked={deliveryDate === 'now'}
            onChange={(e) => onDeliveryDateChange(e.target.value)}
            className="w-4 h-4 text-purple-600"
          />
          <Send className="h-5 w-5 text-green-500" />
          <div>
            <span className="text-gray-700 font-medium">Send immediately</span>
            <p className="text-sm text-gray-500">Gift card will be delivered right away</p>
          </div>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="deliveryDate"
            value="scheduled"
            checked={deliveryDate === 'scheduled'}
            onChange={(e) => onDeliveryDateChange(e.target.value)}
            className="w-4 h-4 text-purple-600"
          />
          <Clock className="h-5 w-5 text-blue-500" />
          <div>
            <span className="text-gray-700 font-medium">Schedule for later</span>
            <p className="text-sm text-gray-500">Choose a specific date and time</p>
          </div>
        </label>
        
        {deliveryDate === 'scheduled' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="ml-7 mt-3"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Delivery Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledDate || ''}
              onChange={(e) => onScheduledDateChange?.(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min={new Date().toISOString().slice(0, 16)}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default GiftCardDeliveryDate