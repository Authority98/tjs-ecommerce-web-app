import React, { useState } from 'react';
import { showSuccessToast } from '../utils/toast';

interface OrderConfirmationProps {
  amount: number;
  onOrderConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onCustomerDetailsChange?: (details: { name: string; email: string; phone: string }) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  amount,
  onOrderConfirm,
  onBack,
  loading = false,
  customerDetails,
  onCustomerDetailsChange
}) => {
  const [processing, setProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleConfirmOrder = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill in all required customer details.');
      return;
    }
    
    if (!agreed) {
      alert('Please agree to the terms and conditions to proceed.');
      return;
    }

    setProcessing(true);
    try {
      showSuccessToast('🎉 Order confirmed! Processing your request...');
      await onOrderConfirm();
    } catch (error) {
      console.error('Error confirming order:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-amber-950/20 rounded-3xl shadow-xl p-6 sm:p-8 border border-amber-200 dark:border-amber-700/30">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 font-dosis text-center">
        Confirm Your Order
      </h2>
      
      {/* Customer Details Form */}
      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 sm:p-6 mb-6 border border-amber-200 dark:border-amber-700/30">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 font-dosis">
          Your Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={customerDetails.name}
              onChange={(e) => onCustomerDetailsChange?.({ ...customerDetails, name: e.target.value })}
              placeholder="Enter your full name"
              className="w-full p-2 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={customerDetails.email}
                onChange={(e) => onCustomerDetailsChange?.({ ...customerDetails, email: e.target.value })}
                placeholder="Enter your email address"
                className="w-full p-2 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerDetails.phone}
                onChange={(e) => onCustomerDetailsChange?.({ ...customerDetails, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="w-full p-2 border border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>
          
          <div className="border-t border-amber-200 dark:border-amber-700/30 pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Estimated Total:</span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-4 sm:p-6 mb-6 border border-blue-200 dark:border-blue-700/30">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Payment Information
            </h4>
            <div className="space-y-2 text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
              <p>
                The final price will be determined after you place your order based on your specific requirements and customizations.
              </p>
              <p>
                After order confirmation, we will send a payment link to your email address and phone number for secure payment processing.
              </p>
              <p>
                Our team will also contact you to confirm order details and arrange delivery or service scheduling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">
              terms and conditions
            </a>{' '}
            and understand that payment will be collected after order confirmation via a secure payment link sent to my email and phone.
          </span>
        </label>
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
          type="button"
          onClick={handleConfirmOrder}
          disabled={!agreed || processing || loading}
          className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Confirm Order - $${amount.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;