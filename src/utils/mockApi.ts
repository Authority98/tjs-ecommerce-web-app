// Mock API endpoint for development
// In production, this should be replaced with a proper backend endpoint

export const mockCreatePaymentIntent = async (amount: number, currency: string = 'usd') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful response
  return {
    client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
    id: `pi_mock_${Date.now()}`,
    amount: amount * 100, // Amount in cents
    currency,
    status: 'requires_payment_method'
  };
};

export const mockConfirmPayment = async (clientSecret: string, cardNumber?: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const paymentIntentId = clientSecret.replace('_secret_', '_').split('_secret_')[0];
  
  // Simulate different card scenarios based on card number
  if (cardNumber) {
    // Remove spaces from card number for comparison
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    // Declined card
    if (cleanCardNumber === '4000000000000002') {
      return {
        error: {
          type: 'card_error',
          code: 'card_declined',
          message: 'Your card was declined.',
          decline_code: 'generic_decline'
        }
      };
    }
    
    // Insufficient funds
    if (cleanCardNumber === '4000000000009995') {
      return {
        error: {
          type: 'card_error',
          code: 'card_declined',
          message: 'Your card has insufficient funds.',
          decline_code: 'insufficient_funds'
        }
      };
    }
    
    // Requires 3D Secure authentication
    if (cleanCardNumber === '4000002500003155') {
      return {
        error: {
          type: 'card_error',
          code: 'authentication_required',
          message: 'Your card requires authentication to complete this payment.',
          payment_intent: {
            id: paymentIntentId,
            status: 'requires_action'
          }
        }
      };
    }
    
    // Expired card
    if (cleanCardNumber === '4000000000000069') {
      return {
        error: {
          type: 'card_error',
          code: 'expired_card',
          message: 'Your card has expired.'
        }
      };
    }
    
    // Invalid CVC
    if (cleanCardNumber === '4000000000000127') {
      return {
        error: {
          type: 'card_error',
          code: 'incorrect_cvc',
          message: 'Your card\'s security code is incorrect.'
        }
      };
    }
  }
  
  // Default successful payment (for 4242424242424242 and other valid cards)
  return {
    paymentIntent: {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 0,
      currency: 'usd'
    }
  };
};