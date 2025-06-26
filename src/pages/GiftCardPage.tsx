import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  DollarSign,
  Heart,
  User,
  MessageCircle,
  Calendar,
  Zap
} from 'lucide-react'
import StepNavigation from '../components/StepNavigation'
import StepHeader from '../components/StepHeader'
import GiftCardAmountSelection from '../components/giftcard/GiftCardAmountSelection'
import GiftCardRecipientSelection from '../components/giftcard/GiftCardRecipientSelection'
import GiftCardRecipientDetails from '../components/giftcard/GiftCardRecipientDetails'
import GiftCardPersonalMessage from '../components/giftcard/GiftCardPersonalMessage'
import GiftCardDeliveryDate from '../components/giftcard/GiftCardDeliveryDate'
import GiftCardPreview from '../components/giftcard/GiftCardPreview'

interface GiftCardData {
  amount: number
  recipientEmail: string
  recipientName: string
  senderName: string
  personalMessage: string
  deliveryDate: string
  isForSelf: boolean | undefined
}

const GiftCardPage: React.FC = () => {
  const navigate = useNavigate()
  const [giftCardData, setGiftCardData] = useState<GiftCardData>({
    amount: 50,
    recipientEmail: '',
    recipientName: '',
    senderName: '',
    personalMessage: '',
    deliveryDate: 'now',
    isForSelf: undefined as any
  })

  const [selectedAmount, setSelectedAmount] = useState(0)
  const [showCustomAmount, setShowCustomAmount] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [scheduledDate, setScheduledDate] = useState('')

  const steps = [
    { id: 'amount', title: 'Gift Amount', icon: DollarSign, description: 'Choose the perfect amount' },
    { id: 'recipient', title: 'Gift For', icon: Heart, description: 'Who is this gift for?' },
    { id: 'details', title: 'Recipient Details', icon: User, description: 'Enter recipient information' },
    { id: 'message', title: 'Personal Message', icon: MessageCircle, description: 'Add a personal touch' },
    { id: 'delivery', title: 'Delivery Date', icon: Calendar, description: 'When to send the gift' }
  ]



  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setGiftCardData(prev => ({ ...prev, amount }))
    setShowCustomAmount(false)
    setCustomAmount('')
  }

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount)
    if (amount >= 10 && amount <= 1000) {
      setSelectedAmount(amount)
      setGiftCardData(prev => ({ ...prev, amount }))
    }
  }

  const handleRecipientSelect = (isForSelf: boolean) => {
    setGiftCardData(prev => ({ ...prev, isForSelf }))
  }

  const handleDataChange = (data: Partial<typeof giftCardData>) => {
    setGiftCardData(prev => ({ ...prev, ...data }))
  }

  const handleMessageChange = (message: string) => {
    setGiftCardData(prev => ({ ...prev, personalMessage: message }))
  }

  const handleDeliveryDateChange = (date: string) => {
    setGiftCardData(prev => ({ ...prev, deliveryDate: date }))
  }

  const handleBuyNow = () => {
    const checkoutData = {
      type: 'giftcard',
      giftCard: {
        ...giftCardData,
        amount: selectedAmount,
        scheduledDate: scheduledDate
      },
      totalAmount: selectedAmount
    }
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
    navigate('/checkout?type=giftcard')
  }

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return selectedAmount > 0
      case 1: return giftCardData.isForSelf !== undefined
      case 2: return giftCardData.isForSelf === true || (giftCardData.recipientName && giftCardData.recipientEmail)
      case 3: return true // Personal message is optional
      case 4: return giftCardData.deliveryDate
      default: return false
    }
  }

  const canProceed = steps.every((_, index) => {
    // Skip details step if for self
    if (index === 2 && giftCardData.isForSelf === true) return true
    return isStepComplete(index)
  })

  const handlePrevStep = () => {
    let prevStep = activeStep - 1
    // Skip details step if for self when going back
    if (prevStep === 2 && giftCardData.isForSelf === true) {
      prevStep = 1
    }
    setActiveStep(Math.max(0, prevStep))
  }

  const handleNextStep = () => {
    let nextStep = activeStep + 1
    // Skip details step if for self when going forward
    if (nextStep === 2 && giftCardData.isForSelf === true) {
      nextStep = 3
    }
    setActiveStep(Math.min(steps.length - 1, nextStep))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎁 <span className="text-purple-700">eGift Cards</span>
          </h1>
          <p className="text-xl text-gray-600">
            The perfect gift for any occasion
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gift Card Preview */}
          <GiftCardPreview
            selectedAmount={selectedAmount}
            recipientName={giftCardData.recipientName}
            senderName={giftCardData.senderName}
            personalMessage={giftCardData.personalMessage}
            isForSelf={giftCardData.isForSelf}
          />

          {/* Step-by-Step Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20"
              >
                {/* Step Navigation */}
                <div className="mb-8 relative">
                  <StepNavigation
                    activeStep={activeStep}
                    totalSteps={steps.length}
                    canProceed={canProceed}
                    isStepComplete={isStepComplete(activeStep)}
                    onPrevStep={handlePrevStep}
                    onNextStep={handleNextStep}
                    onProceedToCheckout={handleBuyNow}
                  />
                  <StepHeader
                    title={steps[activeStep].title}
                    description={steps[activeStep].description}
                    icon={steps[activeStep].icon}
                  />
                </div>

                {/* Step Content */}
                {activeStep === 0 && (
                  <GiftCardAmountSelection
                    selectedAmount={selectedAmount}
                    showCustomAmount={showCustomAmount}
                    customAmount={customAmount}
                    onAmountSelect={handleAmountSelect}
                    onCustomAmountToggle={() => setShowCustomAmount(!showCustomAmount)}
                    onCustomAmountChange={setCustomAmount}
                    onCustomAmountConfirm={handleCustomAmount}
                  />
                )}

                {activeStep === 1 && (
                  <GiftCardRecipientSelection
                    isForSelf={giftCardData.isForSelf}
                    onRecipientSelect={handleRecipientSelect}
                  />
                )}

                {activeStep === 2 && giftCardData.isForSelf === false && (
                  <GiftCardRecipientDetails
                    giftCardData={giftCardData}
                    onDataChange={handleDataChange}
                  />
                )}

                {activeStep === 3 && (
                  <GiftCardPersonalMessage
                    personalMessage={giftCardData.personalMessage}
                    onMessageChange={handleMessageChange}
                  />
                )}

                {activeStep === 4 && (
                  <GiftCardDeliveryDate
                    deliveryDate={giftCardData.deliveryDate}
                    scheduledDate={scheduledDate}
                    onDeliveryDateChange={handleDeliveryDateChange}
                    onScheduledDateChange={setScheduledDate}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GiftCardPage