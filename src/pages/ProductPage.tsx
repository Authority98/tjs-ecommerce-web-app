import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Product } from '../types'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Sparkles, TreePine, Ribbon, Star, Gift, Snowflake, Crown, Heart } from 'lucide-react'

const ProductPage: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryInfo = () => {
    switch (category) {
      case 'decorations':
        return {
          title: 'Christmas Decorations',
          gradient: 'from-purple-500 via-fuchsia-500 to-violet-400',
          bgGradient: 'from-purple-50/80 via-fuchsia-50/60 to-violet-50/40 dark:from-purple-950/20 dark:via-fuchsia-950/15 dark:to-violet-950/10',
          accentColor: 'purple'
        }
      case 'ribbons':
        return {
          title: 'Premium Ribbons',
          gradient: 'from-violet-400 via-purple-400 to-fuchsia-300',
          bgGradient: 'from-violet-50/60 via-purple-50/40 to-fuchsia-50/30 dark:from-violet-950/15 dark:via-purple-950/10 dark:to-fuchsia-950/8',
          accentColor: 'violet'
        }
      case 'trees':
        return {
          title: 'Christmas Trees',
          gradient: 'from-purple-600 via-violet-600 to-fuchsia-500',
          bgGradient: 'from-purple-50/80 via-violet-50/60 to-fuchsia-50/40 dark:from-purple-950/20 dark:via-violet-950/15 dark:to-fuchsia-950/10',
          accentColor: 'purple'
        }
      default:
        return {
          title: 'Products',
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50/80 to-gray-100/60 dark:from-gray-950/20 dark:to-gray-900/15',
          accentColor: 'gray'
        }
    }
  }

  const categoryInfo = getCategoryInfo()

  if (loading) {
    return <LoadingSpinner />
  }

  const floatingElements = [
    { icon: Star, delay: 0, x: '8%', y: '15%', size: 'h-8 w-8' },
    { icon: Sparkles, delay: 0.8, x: '85%', y: '20%', size: 'h-6 w-6' },
    { icon: Snowflake, delay: 1.6, x: '12%', y: '75%', size: 'h-10 w-10' },
    { icon: Heart, delay: 2.4, x: '88%', y: '80%', size: 'h-7 w-7' },
    { icon: Crown, delay: 3.2, x: '45%', y: '10%', size: 'h-5 w-5' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-bl from-purple-100 via-violet-50 to-fuchsia-100 dark:from-purple-900 dark:via-violet-800 dark:to-purple-700 relative overflow-hidden">
      {/* Enhanced Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-8 dark:opacity-4 pointer-events-none"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + index,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.icon className={`${element.size} text-emerald-600/30 dark:text-emerald-400/20`} />
        </motion.div>
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-red-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">


        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className={`inline-flex p-12 bg-gradient-to-br ${categoryInfo.bgGradient} rounded-3xl shadow-2xl mb-12 border border-white/20 dark:border-gray-700/30`}>
              <Gift className="h-20 w-20 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-6 font-dosis">
              Coming Soon
            </h3>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-md mx-auto leading-relaxed font-manrope">
              We're curating an amazing collection of {category}. Check back soon for magical options!
            </p>
            <Link
              to="/admin"
              className={`inline-flex items-center px-10 py-5 bg-gradient-to-r ${categoryInfo.gradient} text-white font-semibold text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
            >
              <Sparkles className="h-6 w-6 mr-3" />
              Add Products (Admin)
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Enhanced Category Features */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-24 text-center"
          >
            <div className={`inline-flex items-center space-x-12 px-12 py-8 bg-gradient-to-r ${categoryInfo.bgGradient} backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40`}>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
                <span className="font-semibold text-lg">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }} />
                <span className="font-semibold text-lg">Expert Installation</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '1s' }} />
                <span className="font-semibold text-lg">Satisfaction Guaranteed</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductPage