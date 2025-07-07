import React from 'react'
import { Crown, Star, Sparkles, Check } from 'lucide-react'
import { TreeOptions, DECOR_LEVELS } from '../types'

interface DecorationLevelSelectionProps {
  selectedOptions: TreeOptions
  onDecorLevelSelect: (level: number) => void
}

const DecorationLevelSelection: React.FC<DecorationLevelSelectionProps> = ({
  selectedOptions,
  onDecorLevelSelect
}) => {
  const icons = {
    100: Crown,
    75: Star,
    50: Sparkles
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {DECOR_LEVELS.map((level) => {
        const IconComponent = icons[level.percentage as keyof typeof icons]
        
        return (
          <button
            key={level.percentage}
            onClick={() => onDecorLevelSelect(level.percentage)}
            className={`p-6 rounded-2xl border-2 text-center ${
              selectedOptions.decorLevel === level.percentage
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex justify-center mb-3">
              <div className={`p-3 rounded-full ${
                selectedOptions.decorLevel === level.percentage
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
            <div className="font-bold text-xl text-gray-800 dark:text-white mb-1">
              {level.label}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {level.description}
            </div>
            {selectedOptions.decorLevel === level.percentage && (
              <div className="mt-2">
                <Check className="h-5 w-5 text-amber-500 mx-auto" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default DecorationLevelSelection