import React, { useState } from 'react';
import { 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement,
  useStripe, 
  useElements, 
  Elements 
} from '@stripe/react-stripe-js';
import { stripe } from '../lib/stripe';
import { mockCreatePaymentIntent, mockConfirmPayment } from '../utils/mockApi';
import { showErrorToast, showSuccessToast } from '../utils/toast';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  onBack: () => void;
  loading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  onBack,
  loading = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      const errorMessage = 'Payment system is not available. Please try again later.';
      showErrorToast(errorMessage);
      onPaymentError(errorMessage);
      return;
    }

    setProcessing(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setProcessing(false);
      return;
    }

    try {
      // For development, use mock API
      // In production, use mock API as fallback if Stripe is not properly configured
      // Check if we're in development mode or if Stripe is not available
      const isDevelopment = import.meta.env.DEV || !stripe;
      
      if (isDevelopment) {
        // Get card details for mock testing
        const { error: tokenError, token } = await stripe.createToken(cardNumberElement);
        
        if (tokenError) {
          const errorMessage = tokenError.message || 'Invalid card details';
          showErrorToast(errorMessage);
          onPaymentError(errorMessage);
          return;
        }
        
        // Extract card number for mock API testing
        const cardNumber = token?.card?.last4 ? 
          // Reconstruct test card numbers based on last 4 digits
          token.card.last4 === '0002' ? '4000000000000002' :
          token.card.last4 === '3155' ? '4000002500003155' :
          token.card.last4 === '9995' ? '4000000000009995' :
          token.card.last4 === '0069' ? '4000000000000069' :
          token.card.last4 === '0127' ? '4000000000000127' :
          '4242424242424242' // Default success card
          : '4242424242424242';
        
        // Mock payment flow for development
        const paymentIntent = await mockCreatePaymentIntent(amount);
        const result = await mockConfirmPayment(paymentIntent.client_secret, cardNumber);
        
        if (result.error) {
          const errorMessage = result.error.message || 'Payment failed';
          showErrorToast(`💳 Payment Failed: ${errorMessage}`);
          onPaymentError(errorMessage);
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          showSuccessToast('🎉 Payment successful!');
          onPaymentSuccess(result.paymentIntent.id);
        } else {
          const errorMessage = 'Payment failed';
          showErrorToast(`💳 ${errorMessage}`);
          onPaymentError(errorMessage);
        }
      } else {
        // Production payment flow - using local server
        const response = await fetch('http://localhost:3001/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
          }),
        });

        const { client_secret } = await response.json();

        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardNumberElement,
          },
        });

        if (error) {
          const errorMessage = error.message || 'Payment failed';
          showErrorToast(`💳 Payment Failed: ${errorMessage}`);
          onPaymentError(errorMessage);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          showSuccessToast('🎉 Payment successful!');
          onPaymentSuccess(paymentIntent.id);
        }
      }
    } catch (error) {
      const errorMessage = 'Payment processing failed. Please try again.';
      showErrorToast(`💳 ${errorMessage}`);
      onPaymentError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/15 dark:to-orange-950/15 rounded-3xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30 relative">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full blur-xl z-0 opacity-40"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full blur-lg z-0 opacity-40"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis">
        Payment Information
      </h2>
      

      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Card Number
          </label>
          <div className="p-4 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 rounded-lg">
            <CardNumberElement options={elementOptions} />
          </div>
        </div>

        {/* Card Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date
            </label>
            <div className="p-4 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 rounded-lg">
              <CardExpiryElement options={elementOptions} />
            </div>
          </div>

          {/* CVC */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CVC
            </label>
            <div className="p-4 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 rounded-lg">
              <CardCvcElement options={elementOptions} />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            disabled={processing || loading}
            className="px-6 py-3 border border-amber-200 dark:border-amber-700/30 text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!stripe || processing || loading}
            className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

interface StripePaymentProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  onBack: () => void;
  loading?: boolean;
}

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  // Handle case when Stripe is not available
  if (!stripe) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/15 dark:to-red-900/15 rounded-3xl shadow-xl p-8 border border-red-200 dark:border-red-700/30">
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4 font-dosis">
          Payment System Unavailable
        </h2>
        <p className="text-red-700 dark:text-red-300 mb-6">
          The payment system is currently unavailable. This may be due to missing configuration. 
          Please contact support or try again later.
        </p>
        <button
          onClick={props.onBack}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripe}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;