import React, { useState, useEffect } from 'react'
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
      case 4: return !!giftCardData.deliveryDate
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

  const floatingElements = [
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 0, x: '31%', y: '35%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object1.png', delay: 0.5, x: '80%', y: '9%', size: 183 },
    { image: '/assets/images/Vector-Smart-Object-2.png', delay: 1.5, x: '2%', y: '75%', size: 100 },
    { image: '/assets/images/plush.png', delay: 1.2, x: '85%', y: '45%', size: 63 },
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 1.7, x: '40%', y: '80%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object2-1-ss.png', delay: 0.3, x: '13%', y: '16%', size: 81 },
    { image: '/assets/images/sircle2.png', delay: 0.8, x: '80%', y: '67%', size: 66 },
  ]

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
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
            Gift Someone Special
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
            🎁 <span className="text-amber-400">eGift Cards</span>
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            The perfect gift for any occasion
          </p>
        </div>

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
          <div className="lg:col-span-2">
              <div className="relative bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20 rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full blur-xl z-0 opacity-40"></div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full blur-lg z-0 opacity-40"></div>
                </div>
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
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftCardPage