import React from 'react'
import { Clock, Check } from 'lucide-react'
import { TreeOptions, RENTAL_PERIODS } from '../types'

interface RentalPeriodSelectionProps {
  selectedOptions: TreeOptions
  onPeriodSelect: (days: number) => void
}

const RentalPeriodSelection: React.FC<RentalPeriodSelectionProps> = ({
  selectedOptions,
  onPeriodSelect
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
      {RENTAL_PERIODS.map((period) => (
        <button
          key={period.days}
          type="button"
          onClick={() => onPeriodSelect(period.days)}
          className={`p-2 rounded-lg border text-center transition-all duration-200 text-sm ${
            selectedOptions.rentalPeriod === period.days
              ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
              : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 dark:text-white">
              {period.label}
            </span>
            <div className="flex items-center space-x-1">
              {period.additionalCost > 0 && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  +${period.additionalCost}
                </span>
              )}
              {selectedOptions.rentalPeriod === period.days && (
                <Check className="h-3 w-3 text-amber-500" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default RentalPeriodSelection