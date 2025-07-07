import React from 'react'
import { User, Mail } from 'lucide-react'

interface GiftCardData {
  recipientName: string
  recipientEmail: string
  senderName: string
}

interface GiftCardRecipientDetailsProps {
  giftCardData: GiftCardData
  onDataChange: (data: Partial<GiftCardData>) => void
}

const GiftCardRecipientDetails: React.FC<GiftCardRecipientDetailsProps> = ({
  giftCardData,
  onDataChange
}) => {
  return (
    <div className="space-y-4">
      {/* Side-by-side name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Recipient Name *
          </label>
          <input
            type="text"
            value={giftCardData.recipientName}
            onChange={(e) => onDataChange({ recipientName: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            placeholder="Enter recipient's name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Your Name
          </label>
          <input
            type="text"
            value={giftCardData.senderName}
            onChange={(e) => onDataChange({ senderName: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            placeholder="Enter your name"
          />
        </div>
      </div>
      
      {/* Full width email field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Mail className="h-4 w-4 inline mr-1" />
          Recipient Email *
        </label>
        <input
          type="email"
          value={giftCardData.recipientEmail}
          onChange={(e) => onDataChange({ recipientEmail: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          placeholder="Enter recipient's email"
        />
      </div>
    </div>
  )
}

export default GiftCardRecipientDetails