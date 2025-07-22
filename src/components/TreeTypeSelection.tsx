import React from 'react'
import { TreePine, Check } from 'lucide-react'
import { TreeOptions, TreeType, TREE_TYPES } from '../types'

interface TreeTypeSelectionProps {
  selectedOptions: TreeOptions
  onTypeSelect: (type: string) => void
}

const TreeTypeSelection: React.FC<TreeTypeSelectionProps> = ({
  selectedOptions,
  onTypeSelect
}) => {
  const treesByCategory = TREE_TYPES.reduce((acc, tree) => {
    if (!acc[tree.category]) {
      acc[tree.category] = []
    }
    acc[tree.category].push(tree)
    return acc
  }, {} as Record<'Live' | 'Artificial', TreeType[]>)

  return (
    <div className="space-y-8">
      {/* Artificial Trees Section */}
      <div key="Artificial" className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Artificial Trees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {treesByCategory['Artificial'].map((tree) => (
            <button
              key={tree.name}
              onClick={() => onTypeSelect(tree.name)}
              className={`p-4 rounded-xl border text-left relative ${selectedOptions.type === tree.name
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                } ${
                tree.status === 'unavailable' ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              disabled={tree.status === 'unavailable'}
            >
              <div className="flex items-center justify-between mb-2">
                <TreePine className="h-5 w-5 text-purple-600" />
                {selectedOptions.type === tree.name && (
                  <Check className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="font-semibold text-gray-800 dark:text-white mb-1">
                {tree.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {tree.description}
              </div>
              {tree.status === 'custom' && (
                <span className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded">
                  Custom
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Live Trees Section */}
      <div key="Live" className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Live Trees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {treesByCategory['Live'].map((tree) => (
            <button
              key={tree.name}
              onClick={() => onTypeSelect(tree.name)}
              className={`p-4 rounded-xl border text-left relative ${selectedOptions.type === tree.name
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                } ${
                tree.status === 'unavailable' ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              disabled={tree.status === 'unavailable'}
            >
              <div className="flex items-center justify-between mb-2">
                <TreePine className="h-5 w-5 text-purple-600" />
                {selectedOptions.type === tree.name && (
                  <Check className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="font-semibold text-gray-800 dark:text-white mb-1">
                {tree.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {tree.description.includes('October') ? 'Pricing in October' : tree.description}
              </div>
              {tree.category === 'Live' && tree.description.includes('October') && (
                <span className="absolute top-2 right-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded">
                  Pre-order
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TreeTypeSelection