import { useCallback } from 'react'
import { showSuccessToast, showErrorToast, showLoadingToast, TOAST_MESSAGES } from '../utils/toast'

interface UseToastReturn {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showLoading: (message: string) => void
  // Predefined toasts for common actions
  showSizeSelected: (size: string) => void
  showTypeSelected: (type: string) => void
  showRentalSelected: (period: string) => void
  showDecorSelected: (level: string) => void
  showOrderPlaced: () => void
  showOrderUpdated: () => void
  showProductAdded: () => void
  showProductUpdated: () => void
  showProductDeleted: () => void
  showLoginSuccess: () => void
  showLoginError: () => void
  showNetworkError: () => void
  showValidationError: () => void
}

export const useToast = (): UseToastReturn => {
  const showSuccess = useCallback((message: string) => {
    showSuccessToast(message)
  }, [])

  const showError = useCallback((message: string) => {
    showErrorToast(message)
  }, [])

  const showLoading = useCallback((message: string) => {
    return showLoadingToast(message)
  }, [])

  // Predefined toast functions
  const showSizeSelected = useCallback((size: string) => {
    showSuccessToast(TOAST_MESSAGES.SIZE_SELECTED(size))
  }, [])

  const showTypeSelected = useCallback((type: string) => {
    showSuccessToast(TOAST_MESSAGES.TYPE_SELECTED(type))
  }, [])

  const showRentalSelected = useCallback((period: string) => {
    showSuccessToast(TOAST_MESSAGES.RENTAL_SELECTED(period))
  }, [])

  const showDecorSelected = useCallback((level: string) => {
    showSuccessToast(TOAST_MESSAGES.DECOR_SELECTED(level))
  }, [])

  const showOrderPlaced = useCallback(() => {
    showSuccessToast(TOAST_MESSAGES.ORDER_PLACED)
  }, [])

  const showOrderUpdated = useCallback(() => {
    showSuccessToast(TOAST_MESSAGES.ORDER_UPDATED)
  }, [])

  const showProductAdded = useCallback(() => {
    showSuccessToast(TOAST_MESSAGES.PRODUCT_ADDED)
  }, [])

  const showProductUpdated = useCallback(() => {
    showSuccessToast(TOAST_MESSAGES.PRODUCT_UPDATED)
  }, [])

  const showProductDeleted = useCallback(() => {
    showSuccessToast(TOAST_MESSAGES.PRODUCT_DELETED)
  }, [])

  const showLoginSuccess = useCallback(() => {
    showSuccessToast(TOAST_MESSAGES.LOGIN_SUCCESS)
  }, [])

  const showLoginError = useCallback(() => {
    showErrorToast(TOAST_MESSAGES.LOGIN_ERROR)
  }, [])

  const showNetworkError = useCallback(() => {
    showErrorToast(TOAST_MESSAGES.NETWORK_ERROR)
  }, [])

  const showValidationError = useCallback(() => {
    showErrorToast(TOAST_MESSAGES.VALIDATION_ERROR)
  }, [])

  return {
    showSuccess,
    showError,
    showLoading,
    showSizeSelected,
    showTypeSelected,
    showRentalSelected,
    showDecorSelected,
    showOrderPlaced,
    showOrderUpdated,
    showProductAdded,
    showProductUpdated,
    showProductDeleted,
    showLoginSuccess,
    showLoginError,
    showNetworkError,
    showValidationError
  }
}