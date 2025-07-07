import React from 'react'
import { Shield } from 'lucide-react'

interface CompletionIndicatorProps {
  canProceed: boolean
}

const CompletionIndicator: React.FC<CompletionIndicatorProps> = ({ canProceed }) => {
  if (!canProceed) return null

  return (
    <div className="mt-8 flex items-center justify-center space-x-2 text-purple-600 dark:text-amber-400">
      <Shield className="h-5 w-5" />
      <span className="font-medium">Configuration Complete</span>
    </div>
  )
}

export default CompletionIndicator