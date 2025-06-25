import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Ruler, TreePine, Calendar, Palette } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { showSuccessToast, TOAST_MESSAGES } from '../utils/toast'
import { supabase } from '../lib/supabase'
import { Product, TreeOptions, TREE_SIZES, TREE_TYPES, RENTAL_PERIODS, DECOR_LEVELS } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductPreview from '../components/ProductPreview'
import StepNavigation from '../components/StepNavigation'
import StepHeader from '../components/StepHeader'
import TreeSizeSelection from '../components/TreeSizeSelection'
import TreeTypeSelection from '../components/TreeTypeSelection'
import RentalPeriodSelection from '../components/RentalPeriodSelection'
import DecorationLevelSelection from '../components/DecorationLevelSelection'

const TreeCustomization: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<TreeOptions>({
    height: '',
    width: '',
    type: '',
    rentalPeriod: 0,
    decorLevel: 0
  })

  const steps = [
    { id: 'size', title: 'Tree Size', icon: Ruler, description: 'Choose the perfect dimensions' },
    { id: 'type', title: 'Tree Type', icon: TreePine, description: 'Select your preferred variety' },
    { id: 'rental', title: 'Rental Period', icon: Calendar, description: 'How long do you need it?' },
    { id: 'decor', title: 'Decoration Level', icon: Palette, description: 'Customize your style' }
  ]

  useEffect(() => {
    fetchProduct()
  }, [productId])




  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSizeSelect = (size: typeof TREE_SIZES[0]) => {
    setSelectedOptions({
      ...selectedOptions,
      height: `${size.height.metric} (${size.height.imperial})`,
      width: `${size.width.metric} (${size.width.imperial})`
    })
    showSuccessToast(TOAST_MESSAGES.SIZE_SELECTED(size.height.imperial))
    setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1)
      }
    }, 800)
  }

  const calculateTotalPrice = () => {
    if (!product) return 0
    
    const basePrice = product.price
    const rentalPeriod = RENTAL_PERIODS.find(p => p.days === selectedOptions.rentalPeriod)
    const rentalCost = rentalPeriod?.additionalCost || 0
    
    return basePrice + rentalCost
  }

  const handleTypeSelect = (type: string) => {
    setSelectedOptions({ ...selectedOptions, type })
    showSuccessToast(TOAST_MESSAGES.TYPE_SELECTED(type))
    setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1)
      }
    }, 800)
  }

  const handlePeriodSelect = (days: number) => {
    setSelectedOptions({ ...selectedOptions, rentalPeriod: days })
    const period = RENTAL_PERIODS.find(p => p.days === days)
    showSuccessToast(TOAST_MESSAGES.RENTAL_SELECTED(period?.label || ''))
    setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1)
      }
    }, 800)
  }

  const handleDecorLevelSelect = (level: number) => {
    setSelectedOptions({ ...selectedOptions, decorLevel: level })
    const decorLevel = DECOR_LEVELS.find(d => d.percentage === level)
    showSuccessToast(TOAST_MESSAGES.DECOR_SELECTED(decorLevel?.label || ''))
    // Don't auto-advance on last step
  }

  const handleProceedToCheckout = () => {
    const checkoutData = {
      product,
      treeOptions: selectedOptions,
      totalAmount: calculateTotalPrice()
    }
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
    navigate('/checkout')
  }

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return selectedOptions.height && selectedOptions.width
      case 1: return selectedOptions.type
      case 2: return selectedOptions.rentalPeriod >= 0
      case 3: return selectedOptions.decorLevel
      default: return false
    }
  }

  const canProceed = steps.every((_, index) => isStepComplete(index))

  useEffect(() => {
    if (canProceed) {
      showSuccessToast(TOAST_MESSAGES.CONFIGURATION_COMPLETE)
    }
  }, [canProceed])



  const handlePrevStep = () => {
    setActiveStep(Math.max(0, activeStep - 1))
  }

  const handleNextStep = () => {
    setActiveStep(Math.min(steps.length - 1, activeStep + 1))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">Product not found</h2>
          <button
            onClick={() => navigate('/products/trees')}
            className="px-6 py-3 text-white rounded-xl transition-all bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 hover:shadow-purple-400/60 hover:scale-105"
          >
            Back to Trees
          </button>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">
            Customize <span className="text-purple-700 dark:text-amber-400">{product.title}</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <ProductPreview
            product={product}
            selectedOptions={selectedOptions}
            totalPrice={calculateTotalPrice()}
          />

          {/* Customization Panel - Now on Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 p-8 border border-white/20 dark:border-gray-700/30"
              >
                {/* Step Content */}
                <div className="mb-8 relative">
                  <StepNavigation
                    activeStep={activeStep}
                    totalSteps={steps.length}
                    canProceed={canProceed}
                    isStepComplete={isStepComplete(activeStep)}
                    onPrevStep={handlePrevStep}
                    onNextStep={handleNextStep}
                    onProceedToCheckout={handleProceedToCheckout}
                  />
                  <StepHeader
                    title={steps[activeStep].title}
                    description={steps[activeStep].description}
                    icon={steps[activeStep].icon}
                  />
                </div>

                {activeStep === 0 && (
                  <TreeSizeSelection
                    selectedOptions={selectedOptions}
                    onSizeSelect={handleSizeSelect}
                  />
                )}

                {activeStep === 1 && (
                  <TreeTypeSelection
                    selectedOptions={selectedOptions}
                    onTypeSelect={handleTypeSelect}
                  />
                )}

                {activeStep === 2 && (
                  <RentalPeriodSelection
                    selectedOptions={selectedOptions}
                    onPeriodSelect={handlePeriodSelect}
                  />
                )}

                {activeStep === 3 && (
                  <DecorationLevelSelection
                    selectedOptions={selectedOptions}
                    onDecorLevelSelect={handleDecorLevelSelect}
                  />
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default TreeCustomization