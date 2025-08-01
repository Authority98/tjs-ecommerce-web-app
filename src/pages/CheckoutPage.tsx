import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'
import { stripe } from '../lib/stripe'
import { Product, OrderSummary, CustomerDetails, RENTAL_PERIODS } from '../types'
import OrderSummaryComponent from '../components/OrderSummary'
import CustomerDetailsForm from '../components/CustomerDetailsForm'
import SchedulingForm from '../components/SchedulingForm'
import StripePayment from '../components/StripePayment'
import LoadingSpinner from '../components/LoadingSpinner'
import './CheckoutPage.css'

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
  const [rentalPeriod, setRentalPeriod] = useState(45)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState<{
    id: string
    code: string
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    amount: number
  } | null>(null)

  useEffect(() => {
    initializeCheckout()
  }, [])

  const initializeCheckout = async () => {
    try {
      // Check if coming directly with productId (for decorations/ribbons/centerpieces)
      const productId = searchParams.get('productId')
      if (productId) {
        // Clear any existing session storage when switching to a different product
        sessionStorage.removeItem('checkoutData')
        
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
        
        setLoading(false)
        return
      }

      // Check if coming from tree customization or gift card
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
    } catch (error) {
      console.error('Error initializing checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateFinalTotal = () => {
    if (!orderData) return 0
    
    let total = orderData.totalAmount
    
    // Add rental period cost for tree orders
    if (orderData.treeOptions) {
      const period = RENTAL_PERIODS.find(p => p.days === rentalPeriod)
      const rentalCost = period?.additionalCost || 0
      total += rentalCost
    }
    
    // Add additional charges for products (not gift cards)
    if (orderData.type !== 'giftcard') {
      total += 10 // Assembling
      total += 10 // Dismantling
      total += 20 // Delivery
    }
    
    if (rushOrder) total += 150 // Rush order fee
    
    // Apply discount if available (only for products, not gift cards)
    if (appliedDiscount && orderData.type !== 'giftcard') {
      total -= appliedDiscount.amount
    }
    
    return Math.max(0, total) // Ensure total doesn't go below 0
  }

  const getAdditionalCharges = () => {
    if (orderData?.type === 'giftcard') return []
    
    return [
      { name: 'Assembling', amount: 10 },
      { name: 'Dismantling', amount: 10 },
      { name: 'Delivery', amount: 20 }
    ]
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `TJ-${timestamp}-${random}`
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setPaymentProcessing(true)
    await handleSubmitOrder(paymentIntentId)
    setPaymentProcessing(false)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    alert(`Payment failed: ${error}`)
  }

  const handleSubmitOrder = async (paymentIntentId?: string) => {
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
        payment_intent_id: paymentIntentId,
        ...(isGiftCard ? {
          gift_card_id: giftCardId,
          product_id: null
        } : {
          product_id: orderData.product?.id,
          gift_card_id: null,
          tree_height: orderData.treeOptions?.height,
          tree_width: orderData.treeOptions?.width,
          tree_type: orderData.treeOptions?.type,
          rental_period: orderData.treeOptions ? rentalPeriod : null,
          decor_level: orderData.treeOptions?.decorLevel,
          installation_date: installationDate || null,
          teardown_date: teardownDate || null,
          rush_order: rushOrder
        }),
        total_amount: calculateFinalTotal(),
        discount_code_id: appliedDiscount?.id || null,
        discount_amount: appliedDiscount?.amount || 0,
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
      const category = orderData.product?.category || ''
      navigate(`/thank-you?orderNumber=${orderNumber}&total=${calculateFinalTotal()}&orderType=${orderType}&category=${category}`)
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Error placing order. Please try again.')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Define steps based on order type - skip scheduling for gift cards and decoration/ribbon/centrepiece products
  const isGiftCard = orderData?.type === 'giftcard'
  const isDecorationOrRibbon = orderData?.product?.category === 'decorations' || orderData?.product?.category === 'ribbons' || orderData?.product?.category === 'centerpieces'
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

  const floatingElements = [
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 0, x: '31%', y: '35%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object1.png', delay: 0.5, x: '80%', y: '9%', size: 183 },
    { image: '/assets/images/Vector-Smart-Object-2.png', delay: 1.5, x: '2%', y: '75%', size: 100 },
    { image: '/assets/images/plush.png', delay: 1.2, x: '85%', y: '45%', size: 63 },
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 1.7, x: '40%', y: '80%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object2-1-ss.png', delay: 0.3, x: '13%', y: '16%', size: 81 },
    { image: '/assets/images/sircle2.png', delay: 0.8, x: '80%', y: '67%', size: 66 },
  ]

  if (!orderData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Floating Background Elements */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute transition-all duration-700 ease-in-out z-10"
            style={{ 
              left: element.x, 
              top: element.y,
              transform: element.image.includes('Vector-Smart-Object2-1-ss.png') ? 'rotate(256deg)' : 
                        element.image.includes('Vector-Smart-Object1.png') ? 'rotate(260deg)' : 
                        element.image.includes('plush.png') ? 'rotate(76deg)' : 
                        `rotate(${index * 45}deg)`
            }}
          >
            <img 
              src={element.image} 
              alt="Decorative element" 
              className="hover:filter hover:brightness-125 transition-all duration-300"
              style={{ 
                width: `${element.size}px`, 
                height: 'auto'
              }} 
            />
          </div>
        ))}
        
        <div className="min-h-screen flex items-center justify-center pb-16 sm:pb-24 relative z-20 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-16">
            <h1 className="text-white mb-4 sm:mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '24px', lineHeight: '32px', color: '#d9a66c'}}>
              Oops!
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-dosis">No Order Data Found</h2>
            <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto">
              We couldn't find any order information. Please return to the home page and try again.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white rounded-xl text-base sm:text-lg font-medium hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripe}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Floating Background Elements */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute transition-all duration-700 ease-in-out z-10"
            style={{ 
              left: element.x, 
              top: element.y,
              transform: element.image.includes('Vector-Smart-Object2-1-ss.png') ? 'rotate(256deg)' : 
                        element.image.includes('Vector-Smart-Object1.png') ? 'rotate(260deg)' : 
                        element.image.includes('plush.png') ? 'rotate(76deg)' : 
                        `rotate(${index * 45}deg)`
            }}
          >
            <img 
              src={element.image} 
              alt="Decorative element" 
              className="hover:filter hover:brightness-125 transition-all duration-300"
              style={{ 
                width: `${element.size}px`, 
                height: 'auto'
              }} 
            />
          </div>
        ))}
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-16 sm:pb-24 relative z-20">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
              Checkout
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-dosis">Complete Your Order</h2>
            
            <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto px-4">
              Review your order details and complete your purchase
            </p>
            
            {/* Progress Steps */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 mt-8 mb-8 px-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center w-full sm:w-auto justify-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                      step.completed || currentStep === step.number
                        ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white shadow-amber-400/50'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`ml-2 font-medium font-dosis text-sm sm:text-base ${
                      step.completed || currentStep === step.number
                        ? 'text-white bg-amber-500/70 dark:bg-amber-500/70 px-2 sm:px-3 py-1 rounded-lg'
                        : 'text-white bg-gray-600/50 dark:bg-gray-700/50 px-2 sm:px-3 py-1 rounded-lg'
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block w-8 lg:w-12 h-1 bg-white/40 dark:bg-white/30 mx-2 lg:mx-4 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-20">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <div
                key={currentStep}
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
                    rentalPeriod={rentalPeriod}
                    setRentalPeriod={setRentalPeriod}
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                    isTreeOrder={!!orderData.treeOptions}
                  />
                )}
                
                {((currentStep === 3 && !skipScheduling) || (currentStep === 2 && skipScheduling)) && (
                  <StripePayment
                    amount={calculateFinalTotal()}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    onBack={() => setCurrentStep(skipScheduling ? 1 : 2)}
                    loading={paymentProcessing}
                  />
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <OrderSummaryComponent
                orderData={orderData}
                rushOrder={rushOrder}
                finalTotal={calculateFinalTotal()}
                rentalPeriod={orderData.treeOptions ? rentalPeriod : undefined}
                currentStep={currentStep}
                additionalCharges={getAdditionalCharges()}
                appliedDiscount={appliedDiscount}
                onDiscountApplied={setAppliedDiscount}
              />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  )
}

export default CheckoutPage