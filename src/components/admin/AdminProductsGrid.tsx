import React from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Package, Search } from 'lucide-react'
import { Product } from '../../types'
import { getCategoryGradient, getCategoryIcon } from '../../utils/categories'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface AdminProductsGridProps {
  products: Product[]
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => Promise<void>
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: 'all' | 'decorations' | 'ribbons' | 'trees'
  onCategoryChange: (category: 'all' | 'decorations' | 'ribbons' | 'trees') => void
}

const AdminProductsGrid: React.FC<AdminProductsGridProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'trees', label: 'Trees' },
    { id: 'decorations', label: 'Decorations' },
    { id: 'ribbons', label: 'Ribbons' }
  ] as const

  if (products.length === 0 && searchQuery) {
    return (
      <Card className="text-center py-12">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Products Found</h3>
        <p className="text-gray-500 dark:text-gray-500">
          No products match your search "{searchQuery}". Try different keywords.
        </p>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Products Yet</h3>
        <p className="text-gray-500 dark:text-gray-500">Start by adding your first product to the catalog.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const CategoryIcon = getCategoryIcon(product.category)
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className={`flex items-center space-x-2 bg-gradient-to-r ${getCategoryGradient(product.category)} rounded-full px-3 py-1 shadow-lg`}>
                      <CategoryIcon className="h-3 w-3 text-white" />
                      <span className="text-white text-xs font-semibold capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-lg font-bold text-[#F7B541]">${product.price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created: {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => onEditProduct(product)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminProductsGrid