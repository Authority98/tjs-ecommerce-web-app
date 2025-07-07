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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onRecipientSelect(true)}
          className={`p-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
            isForSelf === true
              ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 text-white shadow-2xl border-2 border-white/20'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <Heart className="h-8 w-8" />
            <span>Myself</span>
          </div>
        </button>
        
        <button
          onClick={() => onRecipientSelect(false)}
          className={`p-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
            isForSelf === false
              ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 text-white shadow-2xl border-2 border-white/20'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <Heart className="h-8 w-8" />
            <span>Someone Else</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default GiftCardRecipientSelection