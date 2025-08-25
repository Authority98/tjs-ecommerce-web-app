import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'
import { stripe } from '../lib/stripe'
import { Product, OrderSummary, CustomerDetails, RENTAL_PERIODS, DeliveryConfiguration, DEFAULT_DELIVERY_ZONES, DEFAULT_DELIVERY_ADDONS, TimingSurcharge } from '../types'
import { calculateDeliveryFee } from '../utils/deliveryCalculator'
import { showErrorToast, showSuccessToast, showLoadingToast } from '../utils/toast'
import OrderSummaryComponent from '../components/OrderSummary'
import CustomerDetailsForm from '../components/CustomerDetailsForm'
import SchedulingForm from '../components/SchedulingForm'
import StripePayment from '../components/StripePayment'
import LoadingSpinner from '../components/LoadingSpinner'
import './CheckoutPage.css'

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    unitNumber: '',
    buildingName: '',
    streetAddress: '',
    postalCode: '',
    deliveryZone: '',
    deliveryArea: '',
    deliveryFee: 0
  })
  const [installationDate, setInstallationDate] = useState('')
  const [installationTime, setInstallationTime] = useState('')
  const [teardownDate, setTeardownDate] = useState('')
  const [teardownTime, setTeardownTime] = useState('')
  const [rushOrder, setRushOrder] = useState(false)
  const [rentalPeriod, setRentalPeriod] = useState(45)
  const [decorationLevel, setDecorationLevel] = useState(50)

  const [installationSelected, setInstallationSelected] = useState(false)
  const [teardownSelected, setTeardownSelected] = useState(false)
  const [menPower, setMenPower] = useState(3)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState<{
    id: string
    code: string
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    amount: number
  } | null>(null)
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfiguration | null>(null)
  const [deliveryFee, setDeliveryFee] = useState(20) // Default fallback
  const [deliveryError, setDeliveryError] = useState<string | null>(null)
  const [selectedDeliveryAddOns, setSelectedDeliveryAddOns] = useState<string[]>([])  
  const [timingSurcharges, setTimingSurcharges] = useState<TimingSurcharge[]>([])

  useEffect(() => {
    initializeCheckout()
  }, [])

  // Load delivery configuration
  const loadDeliveryConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_configurations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)

      if (data && data.length > 0 && !error) {
        // Convert database structure to match TypeScript interface
        const configData = data[0]
        const convertedConfig: DeliveryConfiguration = {
          ...configData,
          addOns: configData.add_ons || [],
          isActive: configData.is_active,
          zoneBasedConfig: configData.zones ? { zones: configData.zones } : undefined,
          distanceBasedConfig: configData.distance_config
        }
        
        setDeliveryConfig(convertedConfig)
        console.log('Delivery config loaded:', convertedConfig)
      } else {
        // Use default configuration if none found in database
        const defaultConfig: DeliveryConfiguration = {
          model: 'zone',
          zoneBasedConfig: {
            zones: DEFAULT_DELIVERY_ZONES
          },
          addOns: DEFAULT_DELIVERY_ADDONS,
          isActive: true
        }

        setDeliveryConfig(defaultConfig)
        console.log('Using default delivery config with Northeast zone')
      }
    } catch (error) {
      // Use default configuration on error
      const defaultConfig: DeliveryConfiguration = {
        model: 'zone',
        zoneBasedConfig: {
          zones: DEFAULT_DELIVERY_ZONES
        },
        addOns: DEFAULT_DELIVERY_ADDONS,
        isActive: true
      }
      console.error('Error loading delivery config:', error)
      setDeliveryConfig(defaultConfig)
    }
  }

  useEffect(() => {
    loadDeliveryConfig()
    loadTimingSurcharges()

    // Listen for delivery config updates from admin area
    const handleDeliveryConfigUpdate = () => {
      console.log('🔄 Delivery config update detected in CheckoutPage, reloading...')
      loadDeliveryConfig()
      console.log('✅ Delivery config reload completed in CheckoutPage')
    }

    // Add event listener for delivery config updates
    console.log('📡 Setting up deliveryConfigUpdated event listener in CheckoutPage')
    window.addEventListener('deliveryConfigUpdated', handleDeliveryConfigUpdate)

    // Cleanup event listener
    return () => {
      console.log('🧹 Cleaning up deliveryConfigUpdated event listener in CheckoutPage')
      window.removeEventListener('deliveryConfigUpdated', handleDeliveryConfigUpdate)
    }
  }, [])

  // Load timing surcharges configuration
  const loadTimingSurcharges = async () => {
    try {
      const { data, error } = await supabase
        .from('timing_surcharges')
        .select('*')
        .eq('is_active', true)
        .order('surcharge_type', { ascending: true })
        .order('surcharge_amount', { ascending: true })

      if (error) throw error
      setTimingSurcharges(data || [])
    } catch (error) {
      console.error('Error loading timing surcharges:', error)
      // Keep default hardcoded values as fallback
    }
  }

  // Update delivery fee when customer details change (from ZoneSelector)
  useEffect(() => {
    if (customerDetails?.deliveryFee && orderData?.type !== 'giftcard') {
      setDeliveryFee(customerDetails.deliveryFee)
      setDeliveryError(null)
    } else if (orderData?.type !== 'giftcard') {
      setDeliveryFee(0)
      setDeliveryError(customerDetails?.deliveryZone ? null : 'Please select your delivery zone')
    }
  }, [customerDetails?.deliveryFee, customerDetails?.deliveryZone, orderData?.type])

  // Synchronize rushOrder with selectedDeliveryAddOns
  useEffect(() => {
    if (rushOrder) {
      // Add rush-order to selectedDeliveryAddOns if not already present
      setSelectedDeliveryAddOns(prev => {
        if (!prev.includes('rush-order')) {
          return [...prev, 'rush-order']
        }
        return prev
      })
    } else {
      // Remove rush-order from selectedDeliveryAddOns if present
      setSelectedDeliveryAddOns(prev => prev.filter(id => id !== 'rush-order'))
    }
  }, [rushOrder])

  const initializeCheckout = async () => {
    try {
      // Check if coming from event service selection
      if (location.state?.eventService) {
        const eventService = location.state.eventService
        setOrderData({
          type: 'event',
          eventService: eventService,
          totalAmount: eventService.priceType === 'starting_from' || eventService.priceType === 'fixed' ? eventService.price : 0
        })
        setLoading(false)
        return
      }

      // Check if coming directly with productId (for decorations/ribbons)
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
        
        // Initialize decoration level from tree options
        if (checkoutData.treeOptions?.decorLevel) {
          setDecorationLevel(checkoutData.treeOptions.decorLevel)
        }
        
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
      // Only add installation/teardown charges if services are selected
      if (installationSelected) {
        const timingSurcharge = calculateTotalSurcharge(installationDate, installationTime)
        total += timingSurcharge
      }
      if (teardownSelected) {
        const timingSurcharge = calculateTotalSurcharge(teardownDate, teardownTime)
        total += timingSurcharge
      }
      
      // Add base delivery fee
      total += deliveryFee
      
      // Add delivery add-on fees (including rush order if selected)
      if (deliveryConfig && selectedDeliveryAddOns.length > 0) {
        const addOnFees = selectedDeliveryAddOns.reduce((addOnTotal, addOnId) => {
          const addOn = deliveryConfig.addOns.find(a => a.id === addOnId)
          return addOnTotal + (addOn?.fee || 0)
        }, 0)
        total += addOnFees
      }
    }
    
    // Apply discount if available (only for products, not gift cards)
    if (appliedDiscount && orderData.type !== 'giftcard') {
      total -= appliedDiscount.amount
    }
    
    return Math.max(0, total) // Ensure total doesn't go below 0
  }

  // Helper function to check if a date is weekend
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  // Helper function to get timing surcharge (removed - only day-based surcharges now)
  const getTimingSurcharge = (time: string) => {
    return 0 // No time-based surcharges anymore
  }

  // Helper function to get day type surcharge
  const getDayTypeSurcharge = (dateString: string) => {
    if (!dateString) return 0
    
    // Find matching day-based surcharge from database
    const dayBasedSurcharges = timingSurcharges.filter(s => s.surcharge_type === 'day_based')
    
    for (const surcharge of dayBasedSurcharges) {
      if (surcharge.day_types && surcharge.day_types.includes('weekend') && isWeekend(dateString)) {
        return surcharge.surcharge_amount
      }
      // Add public holiday logic here when implemented
      if (surcharge.day_types && surcharge.day_types.includes('public_holiday')) {
        // TODO: Implement public holiday detection
      }
    }
    
    // Fallback to hardcoded values if no database surcharges found
    return isWeekend(dateString) ? 100 : 0
  }

  // Calculate total surcharge for a given date and time
  const calculateTotalSurcharge = (dateString: string, time: string) => {
    return getTimingSurcharge(time) + getDayTypeSurcharge(dateString)
  }

  // Function to determine if all required options are selected
  const areAllOptionsSelected = () => {
    if (!orderData) return false
    
    const isGiftCard = orderData.type === 'giftcard'
    const isDecorationOrRibbon = orderData.product?.category === 'decorations' || orderData.product?.category === 'ribbons'
    const skipScheduling = isGiftCard || isDecorationOrRibbon
    
    // Check customer details completion
    const customerDetailsComplete = customerDetails.name && customerDetails.email && customerDetails.phone && 
      (isGiftCard || (customerDetails.deliveryZone && customerDetails.streetAddress))
    
    // For products that skip scheduling, only need customer details
    if (skipScheduling) {
      return customerDetailsComplete
    }
    
    // For products that require scheduling, must complete scheduling step
    if (!skipScheduling) {
      // If we're on payment step (step 3), consider all options selected
      if (currentStep >= 3) {
        return true
      }
      
      // If we're on delivery section (step 2), only need customer details to be complete
      if (currentStep === 2) {
        return customerDetailsComplete
      }
      
      // Must be on step 2 or later AND have scheduling requirements met
      if (currentStep < 2) {
        return false // Still on customer details step
      }
      
      // For tree orders, both installation and teardown services must be selected
      if (orderData.treeOptions) {
        const schedulingComplete = installationSelected && teardownSelected
        return customerDetailsComplete && schedulingComplete
      }
      
      // For other products that require scheduling, just need to be past step 1
      return customerDetailsComplete
    }
    
    return customerDetailsComplete
  }

  const getAdditionalCharges = () => {
    if (orderData?.type === 'giftcard') return []
    
    const charges = []
    
    // Add installation charges if selected
    if (installationSelected) {
      const daySurcharge = installationDate ? getDayTypeSurcharge(installationDate) : 0
      
      // Build charge name with surcharge reasons
      let chargeName = 'Assembling'
      if (daySurcharge > 0 && installationDate) {
        const isWeekendDay = isWeekend(installationDate)
        if (isWeekendDay) {
          chargeName += ' (Weekend)'
        }
      }
      
      // Always show installation service, even if no surcharge applies
      charges.push({ name: chargeName, amount: daySurcharge })
    }
    
    // Add teardown charges if selected
    if (teardownSelected) {
      const daySurcharge = teardownDate ? getDayTypeSurcharge(teardownDate) : 0
      
      // Build charge name with surcharge reasons
      let chargeName = 'Dismentaling'
      if (daySurcharge > 0 && teardownDate) {
        const isWeekendDay = isWeekend(teardownDate)
        if (isWeekendDay) {
          chargeName += ' (Weekend)'
        }
      }
      
      // Always show teardown service, even if no surcharge applies
      charges.push({ name: chargeName, amount: daySurcharge })
    }
    
    // Only add delivery charge if there's no delivery error
    if (!deliveryError && deliveryFee > 0) {
      // deliveryFee already contains only the zone-based fee from ZoneSelector
      charges.push({ name: 'Delivery', amount: deliveryFee })
      
      // Add selected delivery add-ons as separate line items
      if (deliveryConfig && selectedDeliveryAddOns.length > 0) {
        selectedDeliveryAddOns.forEach(addOnId => {
          const addOn = deliveryConfig.addOns.find(a => a.id === addOnId)
          if (addOn) {
            charges.push({ name: addOn.name, amount: addOn.fee })
          }
        })
      }
    }
    
    return charges
  }

  const updateCustomerPersonalDetails = (details: { name: string; email: string; phone: string }) => {
    setCustomerDetails({
      ...customerDetails,
      name: details.name,
      email: details.email,
      phone: details.phone
    })
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `TJ-${timestamp}-${random}`
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setPaymentProcessing(true)
    try {
      console.log('Payment successful, submitting order with payment intent:', paymentIntentId)
      await handleSubmitOrder(paymentIntentId)
      console.log('Order submitted successfully')
    } catch (error) {
      console.error('Error in handlePaymentSuccess:', error)
      showErrorToast('Failed to process order. Please contact support.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    showErrorToast(`Payment failed: ${error}`)
  }

  const handleSubmitOrder = async (paymentIntentId?: string) => {
    console.log('Starting handleSubmitOrder with:', { paymentIntentId, orderData, customerDetails })
    
    if (!orderData || !customerDetails.name || !customerDetails.email) {
      console.error('Missing required data:', { orderData: !!orderData, name: !!customerDetails.name, email: !!customerDetails.email })
      throw new Error('Missing required order or customer data')
    }

    try {
      const orderNumber = generateOrderNumber()
      console.log('Generated order number:', orderNumber)
      
      // Define order types within function scope
      const isGiftCard = orderData?.type === 'giftcard'
      const isEventService = orderData?.type === 'event'
      console.log('Order type check:', { orderType: orderData.type, isGiftCard, isEventService })
      
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
        unit_number: customerDetails.unitNumber || null,
        building_name: customerDetails.buildingName || null,
        street_address: customerDetails.streetAddress || null,
        delivery_zone: customerDetails.deliveryZone || null,
        delivery_area: customerDetails.deliveryArea || null,
        delivery_fee: customerDetails.deliveryFee || 0,
        order_type: isGiftCard ? 'giftcard' : isEventService ? 'event' : 'product',
        payment_intent_id: paymentIntentId,
        ...(isGiftCard ? {
          gift_card_id: giftCardId,
          product_id: null,
          event_service_id: null
        } : isEventService ? {
          event_service_id: orderData.eventService?.id,
          product_id: null,
          gift_card_id: null,
          installation_date: installationDate || null,
          installation_time: installationTime || null,
          teardown_date: teardownDate || null,
          teardown_time: teardownTime || null,
          rush_order: rushOrder
        } : {
          product_id: orderData.product?.id,
          gift_card_id: null,
          event_service_id: null,
          tree_height: orderData.treeOptions?.height,
          tree_width: orderData.treeOptions?.width,
          tree_type: orderData.treeOptions?.type,
          rental_period: orderData.treeOptions ? rentalPeriod : null,
          decor_level: decorationLevel,
          men_power: !!orderData.treeOptions ? menPower : null,
          installation_date: installationDate || null,
          installation_time: installationTime || null,
          teardown_date: teardownDate || null,
          teardown_time: teardownTime || null,
          rush_order: rushOrder
        }),
        total_amount: calculateFinalTotal(),
        installation_charges: installationSelected ? (installationDate ? getDayTypeSurcharge(installationDate) : 0) : 0,
        teardown_charges: teardownSelected ? (teardownDate ? getDayTypeSurcharge(teardownDate) : 0) : 0,
        selected_delivery_addons: deliveryConfig && selectedDeliveryAddOns.length > 0 
          ? selectedDeliveryAddOns.map(addOnId => {
              const addOn = deliveryConfig.addOns.find(a => a.id === addOnId)
              return addOn ? { id: addOn.id, name: addOn.name, fee: addOn.fee, enabled: addOn.enabled } : null
            }).filter(Boolean)
          : [],
        rush_order_fee: rushOrder ? (deliveryConfig?.addOns.find(addOn => addOn.id === 'rush-order' && addOn.enabled)?.fee || 150) : 0,
        discount_code_id: appliedDiscount?.id || null,
        discount_amount: appliedDiscount?.amount || 0,
        status: 'pending' as const
      };

      console.log('Inserting order into database:', orderPayload)
      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()

      if (error) {
        console.error('Database insertion error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      console.log('Order inserted successfully:', data)

      // Clear session storage
      sessionStorage.removeItem('checkoutData')
      console.log('Session storage cleared')
      
      // Navigate to thank you page with order number
      const orderType = orderData.giftCard ? 'giftcard' : isEventService ? 'event' : 'product'
      const category = orderData.product?.category || orderData.eventService?.category || ''
      const thankYouUrl = `/thank-you?orderNumber=${orderNumber}&total=${calculateFinalTotal()}&orderType=${orderType}&category=${category}`
      console.log('Navigating to thank you page:', thankYouUrl)
      navigate(thankYouUrl)
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
  const isEventService = orderData?.type === 'event'
  const isDecorationOrRibbon = orderData?.product?.category === 'decorations' || orderData?.product?.category === 'ribbons'
  const skipScheduling = isGiftCard || isDecorationOrRibbon
  
  const steps = skipScheduling 
    ? [
        { number: 1, title: 'Delivery', completed: currentStep > 1 },
        { number: 2, title: 'Payment', completed: currentStep > 2 }
      ]
    : [
        { number: 1, title: 'Scheduling', completed: currentStep > 1 },
        { number: 2, title: 'Delivery', completed: currentStep > 2 },
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
            className="absolute transition-all duration-700 ease-in-out z-0"
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
              className="hover:filter hover:brightness-125 transition-all duration-300 pointer-events-none"
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
            className="absolute transition-all duration-700 ease-in-out z-0"
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
              className="hover:filter hover:brightness-125 transition-all duration-300 pointer-events-none"
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
                {currentStep === 1 && !skipScheduling && (
                  <SchedulingForm
                    installationDate={installationDate}
                    setInstallationDate={setInstallationDate}
                    installationTime={installationTime}
                    setInstallationTime={setInstallationTime}
                    teardownDate={teardownDate}
                    setTeardownDate={setTeardownDate}
                    teardownTime={teardownTime}
                    setTeardownTime={setTeardownTime}
                    rushOrder={rushOrder}
                    setRushOrder={setRushOrder}
                    rentalPeriod={rentalPeriod}
                    setRentalPeriod={setRentalPeriod}
                    decorationLevel={decorationLevel}
                    setDecorationLevel={setDecorationLevel}

                    menPower={menPower}
                    setMenPower={setMenPower}
                    onNext={() => setCurrentStep(2)}
                    onBack={() => setCurrentStep(1)}
                    isTreeOrder={!!orderData.treeOptions}
                    isEventService={isEventService}
                    installationSelected={installationSelected}
                    setInstallationSelected={setInstallationSelected}
                    teardownSelected={teardownSelected}
                    setTeardownSelected={setTeardownSelected}
                  />
                )}
                
                {((currentStep === 2 && !skipScheduling) || (currentStep === 1 && skipScheduling)) && (
                  <CustomerDetailsForm
                    customerDetails={customerDetails}
                    setCustomerDetails={setCustomerDetails}
                    onNext={() => setCurrentStep(skipScheduling ? 2 : 3)}
                    onBack={skipScheduling ? undefined : () => setCurrentStep(1)}
                    nextButtonText={'Continue to Payment'}
                    isGiftCard={isGiftCard}
                    deliveryConfig={deliveryConfig}
                    selectedDeliveryAddOns={selectedDeliveryAddOns}
                    setSelectedDeliveryAddOns={setSelectedDeliveryAddOns}
                  />
                )}
                
                {((currentStep === 3 && !skipScheduling) || (currentStep === 2 && skipScheduling)) && (
                  <StripePayment
                    amount={calculateFinalTotal()}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    onBack={() => setCurrentStep(skipScheduling ? 1 : 2)}
                    loading={paymentProcessing}
                    customerDetails={{
                      name: customerDetails.name,
                      email: customerDetails.email,
                      phone: customerDetails.phone
                    }}
                    onCustomerDetailsChange={(details) => {
                      setCustomerDetails(prev => ({
                        ...prev,
                        name: details.name,
                        email: details.email,
                        phone: details.phone
                      }));
                    }}
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
                deliveryError={deliveryError || undefined}
                appliedDiscount={appliedDiscount}
                onDiscountApplied={setAppliedDiscount}
                isCalculatingTotal={!areAllOptionsSelected()}
                decorationLevel={decorationLevel}

                selectedDeliveryAddOns={selectedDeliveryAddOns}
                deliveryConfig={deliveryConfig}
                menPower={menPower}
              />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  )
}

export default CheckoutPage