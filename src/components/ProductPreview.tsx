import React from 'react'
import { motion } from 'framer-motion'
import { Ruler, TreePine, Calendar, Palette } from 'lucide-react'
import { Product, TreeOptions } from '../types'
import ProductTags from './ProductTags'
import ImageSlider from './ui/ImageSlider'

interface ProductPreviewProps {
  product: Product
  selectedOptions: TreeOptions
  totalPrice: number
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  selectedOptions,
  totalPrice
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="sticky top-24">
        <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30">
          <div className="relative">
            <ImageSlider
              images={product.images}
              alt={product.title}
              className="w-full h-64"
              showDots={product.images.length > 1}
              showArrows={product.images.length > 1}
              autoPlay={true}
              autoPlayInterval={4000}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 dark:bg-purple-950/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20 dark:border-gray-700/30">
                <span className="text-2xl font-bold" style={{color: '#9333E9'}}>${totalPrice}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-dosis">{product.title}</h3>
            <ProductTags product={product} />
            <p className="text-gray-600 dark:text-gray-300 mb-6 font-manrope">{product.description}</p>
            
            <div className="space-y-3 mb-6">
              {/* Size Selection */}
              <div className="flex items-center space-x-2 text-sm">
                <Ruler className="h-4 w-4" style={{color: '#9333E9'}} />
                {selectedOptions.height ? (
                  <span className="text-gray-600 dark:text-gray-300">Size: {selectedOptions.height}</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 dark:text-gray-500">Size:</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Type Selection */}
              <div className="flex items-center space-x-2 text-sm">
                <TreePine className="h-4 w-4" style={{color: '#9333E9'}} />
                {selectedOptions.type ? (
                  <span className="text-gray-600 dark:text-gray-300">Type: {selectedOptions.type}</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 dark:text-gray-500">Type:</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Rental Period Selection */}
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" style={{color: '#9333E9'}} />
                {selectedOptions.rentalPeriod > 0 ? (
                  <span className="text-gray-600 dark:text-gray-300">Rental: {selectedOptions.rentalPeriod} days</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 dark:text-gray-500">Rental:</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Decoration Level Selection */}
              <div className="flex items-center space-x-2 text-sm">
                <Palette className="h-4 w-4" style={{color: '#9333E9'}} />
                {selectedOptions.decorLevel > 0 ? (
                  <span className="text-gray-600 dark:text-gray-300">Decor: {selectedOptions.decorLevel}%</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 dark:text-gray-500">Decor:</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductPreview