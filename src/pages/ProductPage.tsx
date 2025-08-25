import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ProductPage.css'

import { supabase } from '../lib/supabase'
import { Product, PRODUCT_COLORS } from '../types'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Sparkles, TreePine, Ribbon, Star, Gift, Snowflake, Crown, Heart, Filter, X, SearchX, Clock } from 'lucide-react'

interface Filters {
  colors: string[]
  maxPrice: number
  decorated: 'all' | 'decorated' | 'not-decorated'
}

const ProductPage: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const validCategory = category as 'trees' | 'decorations' | 'ribbons' | undefined
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    colors: [],
    maxPrice: 1000,
    decorated: 'all'
  })
  const filterRef = useRef<HTMLDivElement>(null)
  const filterContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProducts()
    // Reset filters when category changes
    setFilters({
      colors: [],
      maxPrice: 1000,
      decorated: 'all'
    })
  }, [validCategory])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilters])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', validCategory)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
      
      // Set initial max price based on actual products
      if (data && data.length > 0) {
        const prices = data.map(p => p.price)
        const maxPrice = Math.max(...prices)
        setFilters(prev => ({
          ...prev,
          maxPrice: Math.min(maxPrice, 1000) // Cap at 1000 or actual max, whichever is lower
        }))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    
    // Color filters for all categories that support colors
    if ((validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons') && filters.colors.length > 0) {
      count += filters.colors.length
    }
    
    // Decoration filter only for trees
    if (validCategory === 'trees' && filters.decorated !== 'all') {
      count += 1
    }
    
    // Price filter is active if not at maximum value
    const hasCustomMaxPrice = filters.maxPrice < 1000
    if (hasCustomMaxPrice) count += 1
    
    return count
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by colors (for all categories that support colors)
    if ((validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons') && filters.colors.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.color) return false
        
        // Handle comma-separated colors in product.color
        const productColors = product.color.split(',').map(c => c.trim())
        return filters.colors.some(filterColor => 
          productColors.includes(filterColor)
        )
      })
    }

    // Filter by max price
      filtered = filtered.filter(product => 
        product.price <= filters.maxPrice
      )

    // Filter by decoration status (only for trees)
    if (validCategory === 'trees' && filters.decorated !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.decorated === 'decorated') {
          return product.decorated === true
        } else {
          return product.decorated === false || product.decorated === undefined
        }
      })
    }

    setFilteredProducts(filtered)
  }

  const toggleColorFilter = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const clearFilters = () => {
    setFilters({
      colors: [],
      maxPrice: 1000,
      decorated: 'all'
    })
  }

  const getCategoryInfo = () => {
    switch (validCategory) {
      case 'decorations':
        return {
          title: 'Christmas Decorations',
          gradient: 'from-purple-500 via-fuchsia-500 to-violet-400',
          bgGradient: 'from-purple-50/80 via-fuchsia-50/60 to-violet-50/40 dark:from-purple-950/20 dark:via-fuchsia-950/15 dark:to-violet-950/10',
          accentColor: 'purple'
        }
      case 'ribbons':
        return {
          title: 'Christmas Ribbons',
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
  const hasAppliedFilters = getActiveFiltersCount() > 0

  if (loading) {
    return <LoadingSpinner />
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

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
            Our Products
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
            {categoryInfo.title}
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Discover our premium collection of {validCategory === 'trees' ? 'Christmas trees' : validCategory === 'decorations' ? 'festive decorations' : validCategory === 'ribbons' ? 'elegant ribbons' : 'products'} for your perfect holiday celebration
          </p>
        </div>
        {/* Filter Button and Panel */}
        {(validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons') && products.length > 0 && (
          <div ref={filterContainerRef} className="relative mb-16 z-30">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-full border border-white/20 dark:border-gray-700/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Filter Panel - Absolute positioned overlay */}
            {showFilters && (
              <div ref={filterRef} className="absolute top-14 left-0 right-0 z-50 p-6 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden mt-4">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 pointer-events-none">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-xl opacity-30"></div>
                </div>
                <div className="absolute bottom-4 left-4 pointer-events-none">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-lg opacity-30"></div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Colors Filter - For trees, decorations, and ribbons */}
                {(validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons') && (
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {PRODUCT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => toggleColorFilter(color.value)}
                      className={`flex items-center px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                        filters.colors.includes(color.value)
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-fuchsia-50/80 dark:from-purple-900/30 dark:to-fuchsia-900/20 shadow-lg hover:shadow-xl hover:scale-105'
                          : 'border-white/20 dark:border-gray-700/30 bg-white/50 dark:bg-purple-950/10 backdrop-blur-sm hover:shadow-md hover:bg-white/70 dark:hover:bg-purple-900/20'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{color.name}</span>
                    </button>
                  ))}
                      </div>
                    </div>
                  )}

                  {/* Price Filter - For all categories */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Max Price</h3>
                    <div className="p-4 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg relative overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Decorative Element */}
                      <div className="absolute top-2 right-2 pointer-events-none">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-lg opacity-20"></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">$0</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">${filters.maxPrice}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* Decoration Filter - For trees only */}
                  {category === 'trees' && (
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Decoration Status</h3>
                      <div className="p-4 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg relative overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Decorative Element */}
                        <div className="absolute top-2 right-2 pointer-events-none">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-lg opacity-20"></div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {['all', 'decorated', 'undecorated'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setFilters({ ...filters, decorated: option as any })}
                              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                                filters.decorated === option
                                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                                  : 'bg-white/70 dark:bg-purple-950/10 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-purple-900/20 hover:shadow-sm'
                              }`}
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center px-4 py-2 text-sm bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-105"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {filteredProducts.length === 0 && products.length > 0 ? (
          <div className="text-center mb-10 relative z-20">
            <div className="p-12 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-3xl shadow-2xl mb-12 border border-white/20 dark:border-gray-700/30 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-xl opacity-30"></div>
              </div>
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-lg opacity-30"></div>
              </div>
              
              <Filter className="h-20 w-20 text-purple-400 dark:text-purple-300" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-6 font-dosis">
              No Results Found
            </h3>
            <p className="text-xl text-white mb-12 max-w-md mx-auto leading-relaxed font-manrope">
              Try adjusting your filters to see more products.
            </p>
            <button
              onClick={clearFilters}
              className={`inline-flex items-center px-10 py-5 bg-gradient-to-r ${categoryInfo.gradient} text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <X className="h-6 w-6 mr-3" />
              Clear Filters
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center mb-10 relative z-20">
            <div className="p-12 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-3xl shadow-2xl mb-12 border border-white/20 dark:border-gray-700/30 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-xl opacity-30"></div>
              </div>
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-lg opacity-30"></div>
              </div>
              
              <Gift className="h-20 w-20 text-purple-400 dark:text-purple-300" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-6 font-dosis">
              Coming Soon
            </h3>
            <p className="text-xl text-white mb-12 max-w-md mx-auto leading-relaxed font-manrope">
              We're curating an amazing collection of {category}. Check back soon for magical options!
            </p>
            <Link
              to="/admin"
              className={`inline-flex items-center px-10 py-5 bg-gradient-to-r ${categoryInfo.gradient} text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <Sparkles className="h-6 w-6 mr-3" />
              Add Products (Admin)
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-20">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="transform transition-all duration-300 hover:scale-105 hover:translate-y-[-5px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Category Features */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 sm:mt-16 lg:mt-24 text-center relative z-20">
            <div className={`inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:space-x-12 px-4 sm:px-12 py-3 sm:py-8 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-purple-950/20 dark:to-violet-950/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 relative overflow-hidden hover:shadow-2xl transition-all duration-300`}>
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-xl opacity-20"></div>
              </div>
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full blur-lg opacity-20"></div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg" />
                <span className="font-semibold text-sm sm:text-lg">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
                <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg" />
                <span className="font-semibold text-sm sm:text-lg">Expert Installation</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
                <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg" />
                <span className="font-semibold text-sm sm:text-lg">Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage