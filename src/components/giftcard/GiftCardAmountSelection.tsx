import React from 'react'
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onAmountSelect(amount)}
            className={`p-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 ${
              selectedAmount === amount && !showCustomAmount
                ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 text-white shadow-2xl border-2 border-white/20'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="text-sm font-medium mr-1">$</span>
              <span>{amount}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onCustomAmountToggle}
          className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
            showCustomAmount
              ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 text-white shadow-2xl border-2 border-white/20'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
          }`}
        >
          <DollarSign className="h-6 w-6 inline mr-2" />
          Custom Amount
        </button>
      </div>

      {showCustomAmount && (
        <div
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
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
            <button
              onClick={onCustomAmountConfirm}
              disabled={!customAmount || parseFloat(customAmount) < 10 || parseFloat(customAmount) > 1000}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
            Amount must be between $10 and $1000
          </p>
        </div>
      )}
    </div>
  )
}

export default GiftCardAmountSelection