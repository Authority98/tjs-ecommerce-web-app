import React, { useState } from 'react'
import { Crown, Sparkles, Check, Info, X } from 'lucide-react'
import { TreeOptions, DECOR_LEVELS } from '../types'

interface DecorationLevelSelectionProps {
  selectedOptions: TreeOptions
  onDecorLevelSelect: (level: number) => void
  onEventSizeSelect?: (size: 'small' | 'medium' | 'large') => void
}

const DecorationLevelSelection: React.FC<DecorationLevelSelectionProps> = ({
  selectedOptions,
  onDecorLevelSelect,
  onEventSizeSelect
}) => {
  const [showModal, setShowModal] = useState(false)
  
  const icons = {
    100: Crown,
    50: Sparkles
  }

  return (
    <>
      <div className="flex gap-3">
        {DECOR_LEVELS.map((level) => {
          const IconComponent = icons[level.percentage as keyof typeof icons]
          
          return (
            <div key={level.percentage} className="flex-1">
              <button
                onClick={() => onDecorLevelSelect(level.percentage)}
                className={`w-full p-3 rounded-lg border text-center transition-all duration-200 ${
                  selectedOptions.decorLevel === level.percentage
                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                    : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${
                      selectedOptions.decorLevel === level.percentage
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    <span className="font-medium text-sm">{level.label}</span>
                    {level.percentage === 100 && level.detailedDescription && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowModal(true)
                        }}
                        className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center space-x-1 ml-1"
                      >
                        <Info className="h-3 w-3" />
                        <span>Learn more</span>
                      </button>
                    )}
                  </div>
                  {selectedOptions.decorLevel === level.percentage && (
                    <Check className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Premium Decor Event Sizing */}
      {selectedOptions.decorLevel === 100 && (
        <div className="mt-3 p-3 bg-amber-50/40 dark:bg-amber-900/15 rounded-lg">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Event Size</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
                onClick={() => onEventSizeSelect?.('small')}
                className={`text-center p-2 rounded border transition-all duration-200 ${
                  selectedOptions.eventSize === 'small'
                    ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-500'
                    : 'bg-white/60 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/50 hover:border-amber-300 dark:hover:border-amber-600'
                }`}
              >
              <div className={`text-xs font-medium ${
                selectedOptions.eventSize === 'small'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>Small Event</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">(≤50 people)</div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400">$1,200</div>
            </button>
            <button
              onClick={() => onEventSizeSelect?.('medium')}
              className={`text-center p-2 rounded border transition-all duration-200 ${
                selectedOptions.eventSize === 'medium'
                  ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-500'
                  : 'bg-white/60 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/50 hover:border-amber-300 dark:hover:border-amber-600'
              }`}
            >
              <div className={`text-xs font-medium ${
                selectedOptions.eventSize === 'medium'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>Medium Event</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">(51-150 people)</div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400">$2,500</div>
            </button>
            <button
              onClick={() => onEventSizeSelect?.('large')}
              className={`text-center p-2 rounded border transition-all duration-200 ${
                selectedOptions.eventSize === 'large'
                  ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-500'
                  : 'bg-white/60 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/50 hover:border-amber-300 dark:hover:border-amber-600'
              }`}
            >
              <div className={`text-xs font-medium ${
                selectedOptions.eventSize === 'large'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>Large/Corporate</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">(150+ people)</div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400">$4,500+</div>
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white">
                <Crown className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Premium Decor Package
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {DECOR_LEVELS.find(level => level.percentage === 100)?.detailedDescription}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default DecorationLevelSelection