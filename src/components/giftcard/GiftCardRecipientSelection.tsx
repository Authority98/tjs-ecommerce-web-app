import React from 'react'
import { Heart } from 'lucide-react'

interface GiftCardRecipientSelectionProps {
  isForSelf: boolean | undefined
  onRecipientSelect: (isForSelf: boolean) => void
}

const GiftCardRecipientSelection: React.FC<GiftCardRecipientSelectionProps> = ({
  isForSelf,
  onRecipientSelect
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onRecipientSelect(true)}
          className={`p-4 rounded-xl font-medium ${
            isForSelf === true
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Heart className="h-5 w-5 mx-auto mb-2" />
          Myself
        </button>
        
        <button
          onClick={() => onRecipientSelect(false)}
          className={`p-4 rounded-xl font-medium ${
            isForSelf === false
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Heart className="h-5 w-5 mx-auto mb-2" />
          Someone Else
        </button>
      </div>
    </div>
  )
}

export default GiftCardRecipientSelection