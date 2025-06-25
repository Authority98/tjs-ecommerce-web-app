import React from 'react'
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react'

interface StepNavigationProps {
  activeStep: number
  totalSteps: number
  canProceed: boolean
  isStepComplete: boolean
  onPrevStep: () => void
  onNextStep: () => void
  onProceedToCheckout: () => void
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  activeStep,
  totalSteps,
  canProceed,
  isStepComplete,
  onPrevStep,
  onNextStep,
  onProceedToCheckout
}) => {
  return (
    <div className="absolute top-0 right-0 flex space-x-3">
      {activeStep > 0 && (
        <button
          onClick={onPrevStep}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-100 to-violet-200 dark:from-purple-700 dark:to-violet-600 font-medium shadow-sm border-2 border-purple-300 dark:border-purple-500 rounded-xl hover:from-purple-200 hover:to-violet-300 dark:hover:from-purple-600 dark:hover:to-violet-500 transition-all text-purple-700 dark:text-purple-200 hover:shadow-purple-300/50"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
      )}
      {activeStep < totalSteps - 1 ? (
        <button
          onClick={onNextStep}
          className="flex items-center px-4 py-2.5 text-white font-medium shadow-lg rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:from-purple-400 disabled:to-violet-400 hover:shadow-purple-400/60 hover:scale-105"
          disabled={!isStepComplete}
        >
          Next Step
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      ) : canProceed && (
        <button
          onClick={onProceedToCheckout}
          className="flex items-center px-6 py-3 text-white font-bold text-lg shadow-xl rounded-2xl transition-all transform hover:scale-110 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 hover:shadow-purple-500/70 animate-pulse"
        >
          <ShoppingBag className="w-6 h-6 mr-2" />
          Proceed to Checkout
          <ArrowRight className="w-6 h-6 ml-2" />
        </button>
      )}
    </div>
  )
}

export default StepNavigation