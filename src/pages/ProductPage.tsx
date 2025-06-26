import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'
import { Product, PRODUCT_COLORS } from '../types'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Sparkles, TreePine, Ribbon, Star, Gift, Snowflake, Crown, Heart, Filter, X } from 'lucide-react'

interface Filters {
  colors: string[]
  maxPrice: number
  decorated: 'all' | 'decorated' | 'not-decorated'
}

const ProductPage: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const validCategory = category as 'trees' | 'decorations' | 'ribbons' | 'centrepieces' | undefined
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
    if ((validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons' || validCategory === 'centrepieces') && filters.colors.length > 0) {
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
    if ((validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons' || validCategory === 'centrepieces') && filters.colors.length > 0) {
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
      case 'centrepieces':
        return {
          title: 'Centre Pieces',
          gradient: 'from-amber-400 via-yellow-400 to-orange-300',
          bgGradient: 'from-amber-50/80 via-yellow-50/60 to-orange-50/40 dark:from-amber-950/20 dark:via-yellow-950/15 dark:to-orange-950/10',
          accentColor: 'amber'
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
        <div
          key={index}
          className="absolute opacity-8 dark:opacity-4 pointer-events-none"
          style={{ left: element.x, top: element.y }}
        >
          <element.icon className={`${element.size} text-emerald-600/30 dark:text-emerald-400/20`} />
        </div>
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-red-400/5 to-pink-400/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Filter Button and Panel */}
        {(validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons' || validCategory === 'centrepieces') && products.length > 0 && (
          <div ref={filterContainerRef} className="relative mb-8">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {(filters.colors.length > 0 || filters.decorated !== 'all') && (
                <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                  {filters.colors.length + (filters.decorated !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Filter Panel - Absolute positioned overlay */}
            {showFilters && (
              <div ref={filterRef} className="absolute top-16 left-0 right-0 z-50 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/40">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Colors Filter - For trees, decorations, ribbons, and centrepieces */}
                  {(validCategory === 'trees' || validCategory === 'decorations' || validCategory === 'ribbons' || validCategory === 'centrepieces') && (
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {PRODUCT_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => toggleColorFilter(color.value)}
                            className={`flex items-center px-3 py-2 rounded-lg border-2 ${
                              filters.colors.includes(color.value)
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                : 'border-gray-200 dark:border-gray-600'
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

                  {/* Price Range Filter */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Max Price</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Up to: ${filters.maxPrice}</label>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            maxPrice: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        $0 - ${filters.maxPrice}
                      </div>
                    </div>
                  </div>

                  {/* Decoration Status Filter - For trees only */}
                  {validCategory === 'trees' && (
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Decoration</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'all', label: 'All' },
                          { value: 'decorated', label: 'Decorated' },
                          { value: 'not-decorated', label: 'Not Decorated' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFilters(prev => ({ ...prev, decorated: option.value as any }))}
                            className={`px-4 py-2 rounded-lg border-2 ${
                              filters.decorated === option.value
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {filteredProducts.length === 0 && products.length > 0 ? (
          <div
            className="text-center mb-10"
          >
            <div className={`inline-flex p-12 bg-gradient-to-br ${categoryInfo.bgGradient} rounded-3xl shadow-2xl mb-12 border border-white/20 dark:border-gray-700/30`}>
              <Filter className="h-20 w-20 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-6 font-dosis">
              No Results Found
            </h3>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-md mx-auto leading-relaxed font-manrope">
              Try adjusting your filters to see more products.
            </p>
            <button
              onClick={clearFilters}
              className={`inline-flex items-center px-10 py-5 bg-gradient-to-r ${categoryInfo.gradient} text-white font-semibold text-lg rounded-2xl`}
            >
              <X className="h-6 w-6 mr-3" />
              Clear Filters
            </button>
          </div>
        ) : products.length === 0 ? (
          <div
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
              className={`inline-flex items-center px-10 py-5 bg-gradient-to-r ${categoryInfo.gradient} text-white font-semibold text-lg rounded-2xl`}
            >
              <Sparkles className="h-6 w-6 mr-3" />
              Add Products (Admin)
            </Link>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Category Features */}
        {filteredProducts.length > 0 && (
          <div
            className="mt-24 text-center"
          >
            <div className={`inline-flex items-center space-x-12 px-12 py-8 bg-gradient-to-r ${categoryInfo.bgGradient} backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40`}>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg" />
                <span className="font-semibold text-lg">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg" />
                <span className="font-semibold text-lg">Expert Installation</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg" />
                <span className="font-semibold text-lg">Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage