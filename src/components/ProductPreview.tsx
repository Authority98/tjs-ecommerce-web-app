import React, { useState, Fragment } from 'react'
import { Ruler, TreePine, Calendar, Palette, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Product, TreeOptions } from '../types'
import ProductTags from './ProductTags'
import Lightbox from './ui/Lightbox'

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0)

  const handleImageClick = () => {
    setLightboxInitialIndex(currentImageIndex)
    setIsLightboxOpen(true)
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  return (
    <Fragment>
    <div className="lg:col-span-1">
      <div className="sticky top-24">
        <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30">
          <div className="relative">
            {/* Main Image Display */}
            <div className="relative w-full h-64 overflow-hidden cursor-pointer group" onClick={handleImageClick}>
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.title} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=800"
                }}
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {currentImageIndex + 1}/{product.images.length}
                </div>
              )}
              
              {/* Zoom Icon Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ZoomIn className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </div>
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
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '2s' }}></div>
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
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '2s' }}></div>
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
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '2s' }}></div>
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
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '2s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    
    {/* Lightbox */}
    {isLightboxOpen && (
      <Lightbox
        images={product.images}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={lightboxInitialIndex}
      />
    )}
    </Fragment>
  )
}

export default ProductPreview