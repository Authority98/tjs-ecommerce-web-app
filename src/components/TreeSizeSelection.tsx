import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { TreeOptions, TREE_SIZES } from '../types'

interface TreeSizeSelectionProps {
  selectedOptions: TreeOptions
  onSizeSelect: (size: typeof TREE_SIZES[0]) => void
}

const TreeSizeSelection: React.FC<TreeSizeSelectionProps> = ({
  selectedOptions,
  onSizeSelect
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 font-dosis">
          Choose Your Perfect Size
        </h4>
        <p className="text-gray-500 dark:text-gray-400 font-manrope">
          Select the tree dimensions that best fit your space
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TREE_SIZES.map((size, index) => {
          const isSelected = selectedOptions.height === `${size.height.metric} (${size.height.imperial})`
          const treeHeight = parseFloat(size.height.metric)
          const relativeHeight = Math.min(100, (treeHeight / 5.4) * 100)
          
          return (
            <motion.button
              key={index}
              onClick={() => onSizeSelect(size)}
              className={`relative p-3 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-300/50 scale-105'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
              }`}
              whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center mb-3">
                <div className="relative flex items-end justify-center h-20 mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-gradient-to-t from-purple-600 to-fuchsia-400 rounded-t-full ${
                      isSelected ? 'shadow-lg' : ''
                    }`}
                    style={{ 
                      width: `${Math.max(16, relativeHeight * 0.6)}px`,
                      height: `${Math.max(20, relativeHeight * 0.8)}px`
                    }}
                  />
                  <div className="absolute -bottom-1 w-2 h-3 bg-amber-600 rounded-sm" />
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <Check className="h-5 w-5 text-purple-600" />
                  </motion.div>
                )}
              </div>
              
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-white text-sm mb-1">
                  {size.height.imperial}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {size.height.metric}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  W: {size.width.imperial}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
      
      {selectedOptions.height && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 shadow-purple-200/50"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Check className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold text-purple-700 dark:text-purple-300">Selected Size</span>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <div className="font-medium">Height: {selectedOptions.height}</div>
            <div className="font-medium">Width: {selectedOptions.width}</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TreeSizeSelection