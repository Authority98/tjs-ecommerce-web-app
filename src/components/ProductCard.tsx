import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Product } from '../types'
import { Sparkles, TreePine, Gift, Star } from 'lucide-react'
import { getCategoryConfig, getCategoryGradient, getCategoryIcon } from '../utils/categories'
import ProductTags from './ProductTags'
import ImageSlider from './ui/ImageSlider'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const handleProductClick = () => {
    if (product.category === 'trees') {
      return `/tree-customization/${product.id}`
    } else {
      return `/checkout?productId=${product.id}`
    }
  }




  const CategoryIcon = getCategoryIcon(product.category)

  return (
    <motion.div
      className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-100 border border-white/20 dark:border-gray-700/30"
    >
      <div className="relative overflow-hidden">
        <ImageSlider
          images={product.images}
          alt={product.title}
          className="w-full h-72 transition-transform duration-100"
          showDots={product.images.length > 1}
          showArrows={product.images.length > 1}
          autoPlay={false}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none z-0" />
        
        {/* Price Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-6 right-6"
        >
          <div className="bg-white/95 dark:bg-purple-950/20 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/20 dark:border-gray-700/30">
            <span className="text-2xl font-bold text-purple-600 dark:text-amber-400">
              ${product.price}
            </span>
          </div>
        </motion.div>

        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <div className={`flex items-center space-x-2 bg-gradient-to-r ${getCategoryGradient(product.category)} rounded-full px-3 py-1.5 shadow-lg`}>
            <CategoryIcon className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-semibold capitalize">
              {product.category}
            </span>
          </div>
        </div>



        {/* Floating Elements */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="h-6 w-6 text-yellow-400" />
        </motion.div>
      </div>
      
      <div className="p-8">
        <motion.h3 
          className="text-2xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 transition-colors group-hover:text-purple-600 dark:group-hover:text-amber-400 font-dosis"
          whileHover={{ scale: 1.005 }}
        >
          {product.title}
        </motion.h3>
        <ProductTags product={product} />
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed font-manrope">
          {product.description}
        </p>
        
        <Link to={handleProductClick()}>
          <motion.button
            className={`w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r ${getCategoryGradient(product.category)} text-white font-bold text-lg rounded-2xl hover:shadow-xl transition-shadow duration-100 group/btn`}
        whileHover={{ scale: 1.005, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
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
            <motion.div
              className="ml-3"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </Link>


      </div>
    </motion.div>
  )
})

export default ProductCard