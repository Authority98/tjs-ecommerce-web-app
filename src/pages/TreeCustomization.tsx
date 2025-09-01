import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Ruler, TreePine, Calendar, Palette } from 'lucide-react'
// Import CSS directly in the component instead of as a separate file

import { showSuccessToast, TOAST_MESSAGES } from '../utils/toast'
import { supabase } from '../lib/supabase'
import { Product, TreeOptions, TREE_SIZES, TREE_TYPES, RENTAL_PERIODS } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductPreview from '../components/ProductPreview'
import StepNavigation from '../components/StepNavigation'
import StepHeader from '../components/StepHeader'
import TreeSizeSelection from '../components/TreeSizeSelection'
import TreeTypeSelection from '../components/TreeTypeSelection'
import RentalPeriodSelection from '../components/RentalPeriodSelection'


// Add the CSS styles directly in the component
const treeCustomizationStyles = `
  /* Add hover effects for the decorative elements */
  .absolute img:hover {
    filter: brightness(1.2);
    transition: all 0.3s ease;
  }
`;

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
    decorLevel: 75
  })
  const floatingElements = [
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 0, x: '31%', y: '35%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object1.png', delay: 0.5, x: '80%', y: '9%', size: 183 },
    { image: '/assets/images/Vector-Smart-Object-2.png', delay: 1.5, x: '2%', y: '75%', size: 100 },
    { image: '/assets/images/plush.png', delay: 1.2, x: '85%', y: '45%', size: 63 },
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 1.7, x: '40%', y: '80%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object2-1-ss.png', delay: 0.3, x: '13%', y: '16%', size: 81 },
    { image: '/assets/images/sircle2.png', delay: 0.8, x: '80%', y: '67%', size: 66 },
  ]

  const steps = [
    { id: 'size', title: 'Tree Size', icon: Ruler, description: 'Choose the perfect dimensions' },
    { id: 'type', title: 'Tree Type', icon: TreePine, description: 'Select your preferred variety' }
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
    // Use default 45-day rental period for price calculation during customization
    const defaultRentalPeriod = RENTAL_PERIODS.find(p => p.days === 45)
    const rentalCost = defaultRentalPeriod?.additionalCost || 0
    
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
      case 0: return !!(selectedOptions.height && selectedOptions.width)
      case 1: return !!selectedOptions.type
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Apply the CSS styles */}
        <style dangerouslySetInnerHTML={{ __html: treeCustomizationStyles }} />
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
        
        <div className="min-h-screen flex items-center justify-center pb-24 relative z-20">
          <div className="text-center mb-16">
            <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
              Oops!
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-dosis">Product Not Found</h2>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              We couldn't find the product you're looking for. Please try another tree.
            </p>
            <button
              onClick={() => navigate('/products/trees')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-xl text-lg font-medium"
            >
              Back to Trees
            </button>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Apply the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: treeCustomizationStyles }} />
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-20">

        {/* Header */}
        <div className="text-center mb-8 lg:mb-16">
          <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
            Tree Customization
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
            Customize <span className="text-amber-400">{product.title}</span>
          </h2>
          <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto px-4">
            Create your perfect holiday tree with our customization options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 relative z-20">
          <ProductPreview
            product={product}
            selectedOptions={selectedOptions}
          />

          {/* Customization Panel - Now on Right */}
          <div
            className="lg:col-span-2"
          >
              <div
                key={activeStep}
                className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-2xl lg:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/30 relative"
              >
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 rounded-full blur-xl z-0 opacity-40"></div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 rounded-full blur-lg z-0 opacity-40"></div>
                </div>
                {/* Step Content */}
                <div className="mb-8 relative z-10">
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



              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreeCustomization