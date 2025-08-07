import React from 'react'
import { Edit, Trash2, Package, Search } from 'lucide-react'
import { Product } from '../../types'
import { getCategoryGradient, getCategoryIcon, getCategoryConfig } from '../../utils/categories'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ImageSlider from '../ui/ImageSlider'

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


  return (
    <div className="space-y-6">
      {/* Filters - Always visible */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty States or Products Grid */}
      {products.length === 0 && searchQuery ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 shadow-xl border border-gray-200 dark:border-gray-700 text-center py-12">
          {/* Decorative Elements */}
           <div className="absolute top-4 right-4">
             <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-xl" />
           </div>
           <div className="absolute bottom-4 left-4">
             <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-lg" />
           </div>
          <div className="relative">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No Products Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              No products match your search "{searchQuery}". Try different keywords.
            </p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 shadow-xl border border-gray-200 dark:border-gray-700 text-center py-12">
           {/* Decorative Elements */}
           <div className="absolute top-4 right-4">
             <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-xl" />
           </div>
           <div className="absolute bottom-4 left-4">
             <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-lg" />
           </div>
           <div className="relative">
             <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No Products Yet</h3>
             <p className="text-gray-500 dark:text-gray-400">Start by adding your first product to the catalog.</p>
           </div>
         </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const CategoryIcon = getCategoryIcon(product.category)
          
          return (
            <div key={product.id} className="group">
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getCategoryConfig(product.category)?.bgGradient || 'from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20'} shadow-xl border border-gray-200 dark:border-gray-700 h-full group hover:shadow-2xl transition-all duration-300`}>
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${getCategoryGradient(product.category)} rounded-full blur-xl`} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryGradient(product.category)} rounded-full blur-lg`} />
                </div>
                <div className="relative overflow-hidden">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-xl mb-2"
                    />
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0" />
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/95 dark:bg-purple-950/20 backdrop-blur-sm rounded-xl px-3 py-1 shadow-lg border border-white/20 dark:border-gray-700/30">
                      <span className="text-lg font-bold text-purple-600 dark:text-amber-400">
                        ${product.price}
                      </span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`flex items-center space-x-1 bg-gradient-to-r ${getCategoryGradient(product.category)} rounded-full px-2 py-1 shadow-lg`}>
                      <CategoryIcon className="h-3 w-3 text-white" />
                      <span className="text-white text-xs font-semibold capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-1 font-dosis">
                    {product.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed font-manrope font-medium">
                    {product.description}
                  </p>

                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-4 font-medium">
                    Created: {new Date(product.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className={`flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r ${getCategoryGradient(product.category)} text-white py-2 px-3 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105`}
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      )}
    </div>
  )
}

export default AdminProductsGrid