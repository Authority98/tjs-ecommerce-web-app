import React from 'react'
import { Edit, Trash2, Package, Search } from 'lucide-react'
import { Product } from '../../types'
import { getCategoryGradient, getCategoryIcon } from '../../utils/categories'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ImageSlider from '../ui/ImageSlider'

interface AdminProductsGridProps {
  products: Product[]
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => Promise<void>
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: 'all' | 'decorations' | 'ribbons' | 'trees' | 'centrepieces'
  onCategoryChange: (category: 'all' | 'decorations' | 'ribbons' | 'trees' | 'centrepieces') => void
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
    { id: 'ribbons', label: 'Ribbons' },
    { id: 'centrepieces', label: 'Centre Pieces' }
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
        <Card className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Products Found</h3>
          <p className="text-gray-500 dark:text-gray-500">
            No products match your search "{searchQuery}". Try different keywords.
          </p>
        </Card>
      ) : products.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Products Yet</h3>
          <p className="text-gray-500 dark:text-gray-500">Start by adding your first product to the catalog.</p>
        </Card>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const CategoryIcon = getCategoryIcon(product.category)
          
          return (
            <div key={product.id}>
              <Card padding="none" className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden group border border-white/20 dark:border-gray-700/30">
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
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed font-manrope">
                    {product.description}
                  </p>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Created: {new Date(product.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => onEditProduct(product)}
                      className="flex-1 text-blue-600 py-2 rounded-lg text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => onDeleteProduct(product.id)}
                      className="flex-1 text-red-600 py-2 rounded-lg text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
        </div>
      )}
    </div>
  )
}

export default AdminProductsGrid