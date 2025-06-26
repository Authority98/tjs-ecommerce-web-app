import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Product, OrderSummary, CustomerDetails } from '../types'
import OrderSummaryComponent from '../components/OrderSummary'
import CustomerDetailsForm from '../components/CustomerDetailsForm'
import SchedulingForm from '../components/SchedulingForm'
import LoadingSpinner from '../components/LoadingSpinner'

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: ''
  })
  const [installationDate, setInstallationDate] = useState('')
  const [teardownDate, setTeardownDate] = useState('')
  const [rushOrder, setRushOrder] = useState(false)

  useEffect(() => {
    initializeCheckout()
  }, [])

  const initializeCheckout = async () => {
    try {
      // Check if coming from tree customization
      const storedData = sessionStorage.getItem('checkoutData')
      if (storedData) {
        const checkoutData = JSON.parse(storedData)
        setOrderData(checkoutData)
        
        // Auto-fill customer details for gift cards
        if (checkoutData.type === 'giftcard' && checkoutData.giftCard?.senderName) {
          setCustomerDetails(prev => ({
            ...prev,
            name: checkoutData.giftCard.senderName
          }))
        }
        
        setLoading(false)
        return
      }

      // Check if coming directly with productId (for decorations/ribbons)
      const productId = searchParams.get('productId')
      if (productId) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error) throw error

        setOrderData({
          product: data,
          totalAmount: data.price
        })
      }
    } catch (error) {
      console.error('Error initializing checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateFinalTotal = () => {
    if (!orderData) return 0
    
    let total = orderData.totalAmount
    if (rushOrder) total += 150 // Rush order fee
    
    return total
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `TJ-${timestamp}-${random}`
  }

  const handleSubmitOrder = async () => {
    if (!orderData || !customerDetails.name || !customerDetails.email) return

    try {
      const orderNumber = generateOrderNumber()
      
      let giftCardId = null;
      
      // Handle gift card orders
      if (isGiftCard && orderData.giftCard) {
        const giftCardPayload = {
          amount: orderData.giftCard.amount,
          recipient_name: orderData.giftCard.recipientName,
          recipient_email: orderData.giftCard.recipientEmail,
          sender_name: orderData.giftCard.senderName,
          personal_message: orderData.giftCard.personalMessage,
          scheduled_date: orderData.giftCard.scheduledDate || null,
          is_for_self: orderData.giftCard.isForSelf
        };
        
        const { data: giftCardData, error: giftCardError } = await supabase
          .from('gift_cards')
          .insert([giftCardPayload])
          .select('id')
          .single();
          
        if (giftCardError) throw giftCardError;
        giftCardId = giftCardData.id;
      }

      // Create order payload based on order type
      const orderPayload = {
        order_number: orderNumber,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        delivery_address: customerDetails.deliveryAddress,
        order_type: isGiftCard ? 'giftcard' : 'product',
        ...(isGiftCard ? {
          gift_card_id: giftCardId,
          product_id: null
        } : {
          product_id: orderData.product?.id,
          gift_card_id: null,
          tree_height: orderData.treeOptions?.height,
          tree_width: orderData.treeOptions?.width,
          tree_type: orderData.treeOptions?.type,
          rental_period: orderData.treeOptions?.rentalPeriod,
          decor_level: orderData.treeOptions?.decorLevel,
          installation_date: installationDate || null,
          teardown_date: teardownDate || null,
          rush_order: rushOrder
        }),
        total_amount: calculateFinalTotal(),
        status: 'pending' as const
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderPayload])

      if (error) throw error

      // Clear session storage
      sessionStorage.removeItem('checkoutData')
      
      // Navigate to thank you page with order number
      const orderType = orderData.giftCard ? 'giftcard' : 'product'
      navigate(`/thank-you?orderNumber=${orderNumber}&total=${calculateFinalTotal()}&orderType=${orderType}`)
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Error placing order. Please try again.')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-100 dark:from-purple-900 dark:via-violet-800 dark:to-fuchsia-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">No order data found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-xl hover:from-purple-600 hover:to-fuchsia-600 transition-all hover:scale-105 hover:shadow-purple-400/60"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Define steps based on order type - skip scheduling for gift cards and decoration/ribbon/centrepiece products
  const isGiftCard = orderData?.type === 'giftcard'
  const isDecorationOrRibbon = orderData?.product?.category === 'decorations' || orderData?.product?.category === 'ribbons' || orderData?.product?.category === 'centrepieces'
  const skipScheduling = isGiftCard || isDecorationOrRibbon
  
  const steps = skipScheduling 
    ? [
        { number: 1, title: 'Customer Details', completed: currentStep > 1 },
        { number: 2, title: 'Payment', completed: currentStep > 2 }
      ]
    : [
        { number: 1, title: 'Customer Details', completed: currentStep > 1 },
        { number: 2, title: 'Scheduling', completed: currentStep > 2 },
        { number: 3, title: 'Payment', completed: currentStep > 3 }
      ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-100 dark:from-purple-900 dark:via-violet-800 dark:to-fuchsia-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">Complete Your Order</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step.completed || currentStep === step.number
                      ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-purple-400/50'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`ml-2 font-medium font-dosis ${
                    step.completed || currentStep === step.number
                      ? 'text-purple-600 dark:text-amber-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600 mx-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentStep === 1 && (
                <CustomerDetailsForm
                  customerDetails={customerDetails}
                  setCustomerDetails={setCustomerDetails}
                  onNext={() => setCurrentStep(2)}
                  nextButtonText={skipScheduling ? 'Continue to Payment' : 'Continue to Scheduling'}
                  isGiftCard={isGiftCard}
                />
              )}
              
              {currentStep === 2 && !skipScheduling && (
                <SchedulingForm
                  installationDate={installationDate}
                  setInstallationDate={setInstallationDate}
                  teardownDate={teardownDate}
                  setTeardownDate={setTeardownDate}
                  rushOrder={rushOrder}
                  setRushOrder={setRushOrder}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                  isTreeOrder={!!orderData.treeOptions}
                />
              )}
              
              {((currentStep === 3 && !skipScheduling) || (currentStep === 2 && skipScheduling)) && (
                <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 p-8 border border-white/20 dark:border-gray-700/30">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis">Payment Information</h2>
                  
                  <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
                      In production, integrate with Stripe or another payment processor.
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4111 1111 1111 1111"
                        className="w-full p-3 border border-gray-300 dark:border-purple-400/30 bg-white dark:bg-purple-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 dark:hover:border-purple-400 transition-all"
                        disabled
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 dark:border-purple-400/30 bg-white dark:bg-purple-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 dark:hover:border-purple-400 transition-all"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 dark:border-purple-400/30 bg-white dark:bg-purple-950/10 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 dark:hover:border-purple-400 transition-all"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep(skipScheduling ? 1 : 2)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-fuchsia-700 transition-all hover:scale-105 hover:shadow-purple-400/60"
                    >
                      Place Order - ${calculateFinalTotal()}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummaryComponent
              orderData={orderData}
              rushOrder={rushOrder}
              finalTotal={calculateFinalTotal()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage