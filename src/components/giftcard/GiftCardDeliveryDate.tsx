import React from 'react'
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
    <div
      className="space-y-4"
    >
      <div className="space-y-4">
        <label className={`flex items-center space-x-4 cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
          deliveryDate === 'now' 
            ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 text-white border-white/20 shadow-2xl' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 shadow-lg'
        }`}>
          <input
            type="radio"
            name="deliveryDate"
            value="now"
            checked={deliveryDate === 'now'}
            onChange={(e) => onDeliveryDateChange(e.target.value)}
            className="w-5 h-5 text-fuchsia-500"
          />
          <Send className={`h-7 w-7 ${
            deliveryDate === 'now' ? 'text-white' : 'text-green-500'
          }`} />
          <div className="flex-1">
            <span className={`font-bold text-lg ${
              deliveryDate === 'now' ? 'text-white' : 'text-gray-800 dark:text-white'
            }`}>Send immediately</span>
            <p className={`text-sm ${
              deliveryDate === 'now' ? 'text-white/80' : 'text-gray-500 dark:text-gray-300'
            }`}>Gift card will be delivered right away</p>
          </div>
        </label>
        
        <label className={`flex items-center space-x-4 cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
          deliveryDate === 'scheduled' 
            ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 text-white border-white/20 shadow-2xl' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 shadow-lg'
        }`}>
          <input
            type="radio"
            name="deliveryDate"
            value="scheduled"
            checked={deliveryDate === 'scheduled'}
            onChange={(e) => onDeliveryDateChange(e.target.value)}
            className="w-5 h-5 text-fuchsia-500"
          />
          <Clock className={`h-7 w-7 ${
            deliveryDate === 'scheduled' ? 'text-white' : 'text-blue-500'
          }`} />
          <div className="flex-1">
            <span className={`font-bold text-lg ${
              deliveryDate === 'scheduled' ? 'text-white' : 'text-gray-800 dark:text-white'
            }`}>Schedule for later</span>
            <p className={`text-sm ${
              deliveryDate === 'scheduled' ? 'text-white/80' : 'text-gray-500 dark:text-gray-300'
            }`}>Choose a specific date and time</p>
          </div>
        </label>
        
        {deliveryDate === 'scheduled' && (
          <div
            className="ml-7 mt-3"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Delivery Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledDate || ''}
              onChange={(e) => onScheduledDateChange?.(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default GiftCardDeliveryDate