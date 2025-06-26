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
      <div className="grid grid-cols-2 gap-3 mb-4">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onAmountSelect(amount)}
            className={`p-4 rounded-xl font-bold text-lg ${
              selectedAmount === amount && !showCustomAmount
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onCustomAmountToggle}
          className={`px-6 py-3 rounded-xl font-medium ${
            showCustomAmount
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <DollarSign className="h-5 w-5 inline mr-2" />
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
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={onCustomAmountConfirm}
              disabled={!customAmount || parseFloat(customAmount) < 10 || parseFloat(customAmount) > 1000}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Amount must be between $10 and $1000
          </p>
        </div>
      )}
    </div>
  )
}

export default GiftCardAmountSelection