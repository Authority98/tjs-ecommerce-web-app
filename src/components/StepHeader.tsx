import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StepHeaderProps {
  title: string
  description: string
  icon: LucideIcon
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-3 bg-gradient-to-r from-purple-100 to-violet-200 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl shadow-purple-200/50 border border-white/20 dark:border-gray-700/30">
        <Icon className="h-6 w-6 text-fuchsia-500" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-dosis">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 font-manrope">
          {description}
        </p>
      </div>
    </div>
  )
}

export default StepHeader