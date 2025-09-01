import React from 'react'
import { Users, Check } from 'lucide-react'

interface MenPowerSelectionProps {
  selectedMenPower: number
  onMenPowerSelect: (menPower: number) => void
}

const MenPowerSelection: React.FC<MenPowerSelectionProps> = ({
  selectedMenPower,
  onMenPowerSelect
}) => {
  const menPowerOptions = [
    {
      value: 3,
      label: '3-4 Workers',
      description: 'Basic team',
      additionalCost: 0
    },
    {
      value: 5,
      label: '5+ Workers',
      description: '+$250',
      additionalCost: 250
    }
  ]

  return (
    <div className="flex gap-3">
      {menPowerOptions.map((option) => (
        <div key={option.value} className="flex-1">
          <div
            className={`w-full p-3 rounded-lg border text-center transition-all duration-200 cursor-pointer ${
              selectedMenPower === option.value
                ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-amber-300'
            }`}
            onClick={() => onMenPowerSelect(option.value)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className={`h-4 w-4 ${
                  selectedMenPower === option.value
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
                <div className="text-left">
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className={`text-xs ${
                    option.additionalCost === 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {option.description}
                  </div>
                </div>
              </div>
              {selectedMenPower === option.value && (
                <Check className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MenPowerSelection