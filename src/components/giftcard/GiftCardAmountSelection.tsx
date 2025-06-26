import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'

interface GiftCardAmountSelectionProps {
  selectedAmount: number
  showCustomAmount: boolean
  customAmount: string
  onAmountSelect: (amount: number) => void
  onCustomAmountToggle: () => void
  onCustomAmountChange: (value: string) => void
  onCustomAmountConfirm: () => void
}

const GiftCardAmountSelection: React.FC<GiftCardAmountSelectionProps> = ({
  selectedAmount,
  showCustomAmount,
  customAmount,
  onAmountSelect,
  onCustomAmountToggle,
  onCustomAmountChange,
  onCustomAmountConfirm
}) => {
  const predefinedAmounts = [25, 50, 100, 150]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {predefinedAmounts.map((amount) => (
          <motion.button
            key={amount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAmountSelect(amount)}
            className={`p-4 rounded-xl font-bold text-lg transition-all ${
              selectedAmount === amount && !showCustomAmount
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ${amount}
          </motion.button>
        ))}
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCustomAmountToggle}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            showCustomAmount
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <DollarSign className="h-5 w-5 inline mr-2" />
          Custom Amount
        </motion.button>
      </div>

      {showCustomAmount && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="flex space-x-3">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => onCustomAmountChange(e.target.value)}
              placeholder="Enter amount"
              min="10"
              max="1000"
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCustomAmountConfirm}
              disabled={!customAmount || parseFloat(customAmount) < 10 || parseFloat(customAmount) > 1000}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600"
            >
              Confirm
            </motion.button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Amount must be between $10 and $1000
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default GiftCardAmountSelection