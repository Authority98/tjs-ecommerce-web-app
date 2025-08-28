import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Product } from '../types'
import { Sparkles, TreePine, Gift, Star, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { getCategoryConfig, getCategoryGradient, getCategoryIcon } from '../utils/categories'
import ProductTags from './ProductTags'
import Lightbox from './ui/Lightbox'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleProductClick = () => {
    if (product.category === 'trees') {
      return `/tree-customization/${product.id}`
    } else {
      return `/checkout?productId=${product.id}`
    }
  }

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

  const CategoryIcon = getCategoryIcon(product.category)

  const categoryConfig = getCategoryConfig(product.category)

  return (
    <>
    <div
      className={`relative bg-gradient-to-br ${categoryConfig?.bgGradient || 'from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20'} backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30 transition-all duration-300`}
    >
      {/* Decorative Elements */}
      <div className="absolute -top-4 -right-16 w-24 h-24 bg-white/10 rounded-full blur-2xl z-0"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl z-0"></div>
      <div className="relative overflow-hidden group rounded-t-2xl">
        {/* Main Image Display */}
        <div className="relative w-full h-56 bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={product.images[currentImageIndex]}
            alt={`${product.title} ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
            onClick={handleImageClick}
            onError={(e) => {
              e.currentTarget.src = "https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=800"
            }}
          />
          
          {/* Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/60 text-white h-10 w-10 p-0 flex items-center justify-center rounded-full shadow-md focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/60 text-white h-10 w-10 p-0 flex items-center justify-center rounded-full shadow-md focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full shadow-md">
              {currentImageIndex + 1}/{product.images.length}
            </div>
          )}
        </div>
        
        {/* Zoom overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <ZoomIn className="h-6 w-6 text-gray-700" />
          </div>
        </div>
        

        
        {/* Price Badge - Hidden for trees */}
        {product.category !== 'trees' && (
          <div
            className="absolute top-6 right-6 z-10"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-lg border border-white/20 dark:border-gray-700/30">
              <span className="text-xl font-bold text-purple-600 dark:text-amber-400">
                ${product.price}
              </span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <div className={`flex items-center space-x-2 bg-gradient-to-r ${getCategoryGradient(product.category)} rounded-full px-3 py-1.5 shadow-lg`}>
            <CategoryIcon className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-semibold capitalize">
              {product.category}
            </span>
          </div>
        </div>




      </div>
      
      <div className="p-6">
        <h3 
          className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 font-dosis"
        >
          {product.title}
        </h3>
        <ProductTags product={product} />
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed font-manrope text-sm">
          {product.description}
        </p>
        
        <Link to={handleProductClick()}>
          <button
            className={`w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r ${getCategoryGradient(product.category)} text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <span className="flex items-center space-x-3">
              {product.category === 'trees' ? (
                <>
                  <TreePine className="h-5 w-5" />
                  <span>Customize Tree</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Select Product</span>
                </>
              )}
            </span>
            <div
              className="ml-3"
            >
              →
            </div>
          </button>
        </Link>


      </div>

      {/* Decorative Elements - Hidden for trees */}
      {product.category !== 'trees' && (
        <>
          <div className="absolute top-4 right-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${categoryConfig?.gradient || 'from-gray-400 to-gray-500'} rounded-full blur-xl`} />
          </div>
          <div className="absolute bottom-4 left-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${categoryConfig?.gradient || 'from-gray-400 to-gray-500'} rounded-full blur-lg`} />
          </div>
        </>
      )}
    </div>
    
    {/* Lightbox - Moved outside the card container */}
    {isLightboxOpen && (
      <Lightbox
        images={product.images}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={lightboxInitialIndex}
      />
    )}
    </>
  )
})

export default ProductCard