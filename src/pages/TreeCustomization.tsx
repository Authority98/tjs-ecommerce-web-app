import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Ruler, TreePine, Calendar, Palette, 
  Check, ArrowRight, Crown,
  Clock, Star, Zap, Shield, ChevronLeft, ChevronRight,
  ShoppingBag, Sparkles
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product, TreeOptions, TREE_SIZES, TREE_TYPES, RENTAL_PERIODS, DECOR_LEVELS } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductTags from '../components/ProductTags'

const TreeCustomization: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<TreeOptions>({
    height: '',
    width: '',
    type: TREE_TYPES[0],
    rentalPeriod: 45,
    decorLevel: 100
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
  }

  const calculateTotalPrice = () => {
    if (!product) return 0
    
    const basePrice = product.price
    const rentalPeriod = RENTAL_PERIODS.find(p => p.days === selectedOptions.rentalPeriod)
    const rentalCost = rentalPeriod?.additionalCost || 0
    
    return basePrice + rentalCost
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
      case 2: 
        console.log('selectedOptions.rentalPeriod:', selectedOptions.rentalPeriod);
        console.log('isStepComplete(2) returning:', !!selectedOptions.rentalPeriod);
        return !!selectedOptions.rentalPeriod
      case 3: return selectedOptions.decorLevel
      default: return false
    }
  }

  const canProceed = steps.every((_, index) => isStepComplete(index))



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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products/trees')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Trees
          </button>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Customize <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">{product.title}</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Preview - Now on Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30">
                <div className="relative">
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-2xl font-bold text-emerald-600">${calculateTotalPrice()}</span>
                    </div>
                  </div>

                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.title}</h3>
                  <ProductTags product={product} />
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
                  
                  {/* Selected Options Summary */}
                  <div className="space-y-3 mb-6">
                    {selectedOptions.height && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Ruler className="h-4 w-4 text-emerald-600" />
                        <span className="text-gray-600 dark:text-gray-300">Size: {selectedOptions.height}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <TreePine className="h-4 w-4 text-emerald-600" />
                      <span className="text-gray-600 dark:text-gray-300">Type: {selectedOptions.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span className="text-gray-600 dark:text-gray-300">Rental: {selectedOptions.rentalPeriod} days</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Palette className="h-4 w-4 text-emerald-600" />
                      <span className="text-gray-600 dark:text-gray-300">Decor: {selectedOptions.decorLevel}%</span>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Price</p>
                    <p className="text-3xl font-bold text-emerald-600">${calculateTotalPrice()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30"
              >
                {/* Step Content */}
                <div className="mb-8 relative">
                  {/* Navigation Buttons */}
                  <div className="absolute top-0 right-0 flex space-x-3">
                    {activeStep > 0 && (
                      <button
                        onClick={handlePrevStep}
                        className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 font-medium shadow-sm border-2 border-emerald-600 dark:border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                      </button>
                    )}
                    {activeStep < steps.length - 1 ? (
                      <button
                        onClick={handleNextStep}
                        className="flex items-center px-4 py-2.5 bg-emerald-600 text-white font-medium shadow-sm rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                        disabled={!isStepComplete(activeStep)}
                      >
                        Next Step
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                    ) : canProceed && (
                      <button
                        onClick={handleProceedToCheckout}
                        className="flex items-center px-6 py-3 bg-emerald-600 text-white font-medium text-lg shadow-lg rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105"
                      >
                        <ShoppingBag className="w-6 h-6 mr-2" />
                        Proceed to Checkout
                        <ArrowRight className="w-6 h-6 ml-2" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      {React.createElement(steps[activeStep].icon, { 
                        className: "h-6 w-6 text-emerald-600 dark:text-emerald-400" 
                      })}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {steps[activeStep].title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {steps[activeStep].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tree Size Selection - Creative Visual Grid */}
                {activeStep === 0 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Choose Your Perfect Size
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400">
                        Select the tree dimensions that best fit your space
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {TREE_SIZES.map((size, index) => {
                        const isSelected = selectedOptions.height === `${size.height.metric} (${size.height.imperial})`
                        const treeHeight = parseFloat(size.height.metric)
                        const relativeHeight = Math.min(100, (treeHeight / 5.4) * 100) // Scale relative to largest tree
                        
                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleSizeSelect(size)}
                            className={`relative p-3 rounded-xl border transition-all duration-300 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg scale-105'
                                : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                            }`}
                            whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Visual Tree Representation */}
                            <div className="flex flex-col items-center mb-3">
                              <div className="relative flex items-end justify-center h-20 mb-2">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                  className={`bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-full ${
                                    isSelected ? 'shadow-lg' : ''
                                  }`}
                                  style={{ 
                                    width: `${Math.max(16, relativeHeight * 0.6)}px`,
                                    height: `${Math.max(20, relativeHeight * 0.8)}px`
                                  }}
                                />
                                <div className="absolute -bottom-1 w-2 h-3 bg-amber-600 rounded-sm" />
                              </div>
                              
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2"
                                >
                                  <Check className="h-5 w-5 text-emerald-600" />
                                </motion.div>
                              )}
                            </div>
                            
                            <div className="text-center">
                              <div className="font-bold text-gray-800 dark:text-white text-sm mb-1">
                                {size.height.imperial}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {size.height.metric}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                W: {size.width.imperial}
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                    
                    {selectedOptions.height && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Check className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold text-emerald-700 dark:text-emerald-300">Selected Size</span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">
                          <div className="font-medium">Height: {selectedOptions.height}</div>
                          <div className="font-medium">Width: {selectedOptions.width}</div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Tree Type Selection */}
                {activeStep === 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TREE_TYPES.map((type, index) => (
                      <motion.button
                        key={type}
                        onClick={() => setSelectedOptions({ ...selectedOptions, type })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedOptions.type === type
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <TreePine className="h-5 w-5 text-emerald-600" />
                          {selectedOptions.type === type && (
                            <Check className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {type}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {type.includes('Artificial') ? 'Hyper-realistic, reusable' : 'Fresh, natural fragrance'}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Rental Period Selection */}
                {activeStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {RENTAL_PERIODS.map((period) => (
                      <motion.button
                        key={period.days}
                        onClick={() => setSelectedOptions({ ...selectedOptions, rentalPeriod: period.days })}
                        className={`p-6 rounded-2xl border-2 text-center transition-all ${
                          selectedOptions.rentalPeriod === period.days
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex justify-center mb-3">
                          <div className={`p-3 rounded-full ${
                            selectedOptions.rentalPeriod === period.days
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            <Clock className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                          {period.label}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {period.additionalCost > 0 ? `+$${period.additionalCost}` : 'Included'}
                        </div>
                        {selectedOptions.rentalPeriod === period.days && (
                          <div className="mt-2">
                            <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Decoration Level Selection */}
                {activeStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {DECOR_LEVELS.map((level) => {
                      const icons = {
                        100: Crown,
                        75: Star,
                        50: Sparkles
                      }
                      const IconComponent = icons[level.percentage as keyof typeof icons]
                      
                      return (
                        <motion.button
                          key={level.percentage}
                          onClick={() => setSelectedOptions({ ...selectedOptions, decorLevel: level.percentage })}
                          className={`p-6 rounded-2xl border-2 text-center transition-all ${
                            selectedOptions.decorLevel === level.percentage
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                              : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex justify-center mb-3">
                            <div className={`p-3 rounded-full ${
                              selectedOptions.decorLevel === level.percentage
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                          </div>
                          <div className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                            {level.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {level.description}
                          </div>
                          {selectedOptions.decorLevel === level.percentage && (
                            <div className="mt-2">
                              <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                            </div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* Completion Indicator */}
                {canProceed && (
                  <div className="mt-8 flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Configuration Complete</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TreeCustomization