import React from 'react'
import { TreePine, Check } from 'lucide-react'
import { TreeOptions, TREE_TYPES } from '../types'

interface TreeTypeSelectionProps {
  selectedOptions: TreeOptions
  onTypeSelect: (type: string) => void
}

const TreeTypeSelection: React.FC<TreeTypeSelectionProps> = ({
  selectedOptions,
  onTypeSelect
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {TREE_TYPES.map((type, index) => (
        <button
          key={type}
          onClick={() => onTypeSelect(type)}
          className={`p-3 rounded-xl border text-left ${
            selectedOptions.type === type
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <TreePine className="h-5 w-5 text-purple-600" />
            {selectedOptions.type === type && (
              <Check className="h-5 w-5 text-amber-500" />
            )}
          </div>
          <div className="font-semibold text-gray-800 dark:text-white">
            {type}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {type.includes('Artificial') ? 'Hyper-realistic, reusable' : 'Fresh, natural fragrance'}
          </div>
        </button>
      ))}
    </div>
  )
}

export default TreeTypeSelection