import React from 'react'
import { motion } from 'framer-motion'
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {RENTAL_PERIODS.map((period) => (
        <motion.button
          key={period.days}
          onClick={() => onPeriodSelect(period.days)}
          className={`p-6 rounded-2xl border-2 text-center transition-colors duration-200 ${
            selectedOptions.rentalPeriod === period.days
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-center mb-3">
            <div className={`p-3 rounded-full ${
              selectedOptions.rentalPeriod === period.days
                ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="font-bold text-xl text-gray-800 dark:text-white mb-1">
            {period.label}
          </div>
          <div className="font-semibold" style={{color: '#9333E9'}}>
            {period.additionalCost > 0 ? `+$${period.additionalCost}` : 'Included'}
          </div>
          {selectedOptions.rentalPeriod === period.days && (
            <div className="mt-2">
              <Check className="h-5 w-5 text-amber-500 mx-auto" />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  )
}

export default RentalPeriodSelection