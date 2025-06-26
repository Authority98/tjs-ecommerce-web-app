import React from 'react'
import { motion } from 'framer-motion'
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRecipientSelect(true)}
          className={`p-4 rounded-xl font-medium transition-all ${
            isForSelf === true
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Heart className="h-5 w-5 mx-auto mb-2" />
          Myself
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRecipientSelect(false)}
          className={`p-4 rounded-xl font-medium transition-all ${
            isForSelf === false
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Heart className="h-5 w-5 mx-auto mb-2" />
          Someone Else
        </motion.button>
      </div>
    </div>
  )
}

export default GiftCardRecipientSelection