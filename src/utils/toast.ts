import toast from 'react-hot-toast'

export const TOAST_CONFIG = {
  duration: 3000,
  position: 'bottom-right' as const,
  style: {
    background: 'linear-gradient(135deg, #A855F7 0%, #D946EF 100%)',
    color: '#fff',
    fontWeight: '600',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    fontSize: '14px',
    padding: '12px 16px'
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#F7B541'
  }
}

export const showSuccessToast = (message: string) => {
  return toast.success(message, TOAST_CONFIG)
}

export const showErrorToast = (message: string) => {
  return toast.error(message, {
    ...TOAST_CONFIG,
    style: {
      ...TOAST_CONFIG.style,
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444'
    }
  })
}

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    ...TOAST_CONFIG,
    style: {
      ...TOAST_CONFIG.style,
      background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#6B7280'
    }
  })
}

// Predefined toast messages for common actions
export const TOAST_MESSAGES = {
  SIZE_SELECTED: (size: string) => `🌲 Size selected: ${size}`,
  TYPE_SELECTED: (type: string) => `🎄 Tree type selected: ${type}`,
  RENTAL_SELECTED: (period: string) => `📅 Rental period selected: ${period}`,
  DECOR_SELECTED: (level: string) => `🎨 Decoration level selected: ${level}`,
  CONFIGURATION_COMPLETE: '🛡️ Configuration Complete! Ready to proceed.',
  ORDER_PLACED: '🎉 Order placed successfully!',
  ORDER_UPDATED: '✅ Order updated successfully!',
  PRODUCT_ADDED: '✅ Product added successfully!',
  PRODUCT_UPDATED: '✅ Product updated successfully!',
  PRODUCT_DELETED: '🗑️ Product deleted successfully!',
  LOGIN_SUCCESS: '👋 Welcome back!',
  LOGIN_ERROR: '❌ Invalid credentials',
  NETWORK_ERROR: '📶 Network error. Please try again.',
  VALIDATION_ERROR: '⚠️ Please check your input and try again.'
}