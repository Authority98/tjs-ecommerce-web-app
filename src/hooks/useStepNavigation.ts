import { useState, useCallback } from 'react'

interface UseStepNavigationProps {
  totalSteps: number
  initialStep?: number
  autoAdvanceDelay?: number
}

interface UseStepNavigationReturn {
  activeStep: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  autoAdvanceToNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
  canGoNext: boolean
  canGoPrev: boolean
}

export const useStepNavigation = ({
  totalSteps,
  initialStep = 0,
  autoAdvanceDelay = 800
}: UseStepNavigationProps): UseStepNavigationReturn => {
  const [activeStep, setActiveStep] = useState(initialStep)

  const nextStep = useCallback(() => {
    setActiveStep(prev => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setActiveStep(step)
    }
  }, [totalSteps])

  const autoAdvanceToNext = useCallback(() => {
    setTimeout(() => {
      if (activeStep < totalSteps - 1) {
        nextStep()
      }
    }, autoAdvanceDelay)
  }, [activeStep, totalSteps, nextStep, autoAdvanceDelay])

  return {
    activeStep,
    nextStep,
    prevStep,
    goToStep,
    autoAdvanceToNext,
    isFirstStep: activeStep === 0,
    isLastStep: activeStep === totalSteps - 1,
    canGoNext: activeStep < totalSteps - 1,
    canGoPrev: activeStep > 0
  }
}