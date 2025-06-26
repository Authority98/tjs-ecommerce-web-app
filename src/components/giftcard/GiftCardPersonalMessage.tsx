import React from 'react'
import { MessageCircle } from 'lucide-react'

interface GiftCardPersonalMessageProps {
  personalMessage: string
  onMessageChange: (message: string) => void
}

const GiftCardPersonalMessage: React.FC<GiftCardPersonalMessageProps> = ({
  personalMessage,
  onMessageChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MessageCircle className="h-4 w-4 inline mr-1" />
          Personal Message (Optional)
        </label>
        <textarea
          value={personalMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={4}
          maxLength={200}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="Add a personal message to make this gift extra special..."
        />
        <p className="text-sm text-gray-500 mt-2">
          {personalMessage.length}/200 characters
        </p>
      </div>
    </div>
  )
}

export default GiftCardPersonalMessage