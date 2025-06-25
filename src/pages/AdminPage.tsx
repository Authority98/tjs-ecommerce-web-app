import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, LogOut, Eye } from 'lucide-react'
import { Order } from '../types'
import { useAdminData } from '../hooks/useAdminData'
import ProductForm from '../components/ProductForm'
import LoadingSpinner from '../components/LoadingSpinner'
import AdminLogin from '../components/AdminLogin'
import { AdminStats, AdminProductsGrid, AdminOrdersTable } from '../components/admin'
import Button from '../components/ui/Button'

const AdminPage: React.FC = () => {
  const {
    // Data
    products,
    orders,
    filteredProducts,
    loading,
    
    // Filters
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    
    // Auth
    isAuthenticated,
    setIsAuthenticated,
    checkingAuth,
    
    // Actions
    fetchProducts,
    deleteProduct,
    updateOrderStatus,
    handleLogout,
    
    // Stats
    stats
  } = useAdminData()

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  if (checkingAuth) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-fuchsia-50 to-violet-100 dark:from-purple-900 dark:via-fuchsia-900 dark:to-violet-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 font-dosis">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-manrope">
              Manage your products and orders
            </p>
          </div>
          
          <Button
            variant="ghost"
            icon={LogOut}
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            Logout
          </Button>
        </motion.div>

        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-xl hover:shadow-purple-400/60 scale-105'
                : 'bg-gradient-to-r from-purple-100 to-violet-200 dark:from-purple-700 dark:to-violet-600 text-purple-700 dark:text-purple-200 hover:from-purple-200 hover:to-violet-300 dark:hover:from-purple-600 dark:hover:to-violet-500 hover:scale-102'
            }`}
          >
            Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-xl hover:shadow-fuchsia-400/60 scale-105'
                : 'bg-gradient-to-r from-purple-100 to-violet-200 dark:from-purple-700 dark:to-violet-600 text-purple-700 dark:text-purple-200 hover:from-purple-200 hover:to-violet-300 dark:hover:from-purple-600 dark:hover:to-violet-500 hover:scale-102'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-dosis">Products</h2>
              <Button
                icon={Plus}
                onClick={handleAddProduct}
                className="shadow-lg"
              >
                Add Product
              </Button>
            </div>

            <AdminProductsGrid
              products={filteredProducts}
              onEditProduct={handleEditProduct}
              onDeleteProduct={deleteProduct}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis">Orders</h2>
            
            <AdminOrdersTable
              orders={orders}
              onUpdateOrderStatus={updateOrderStatus}
              onViewOrder={handleViewOrder}
            />
          </motion.div>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProductForm
                product={editingProduct}
                onClose={handleFormClose}
              />
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Order Details
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                </div>
                
                {selectedOrder.products && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Product Details</h4>
                    <p><strong>Product:</strong> {selectedOrder.products.title}</p>
                    {selectedOrder.tree_height && (
                      <>
                        <p><strong>Size:</strong> {selectedOrder.tree_height}</p>
                        <p><strong>Type:</strong> {selectedOrder.tree_type}</p>
                        <p><strong>Rental Period:</strong> {selectedOrder.rental_period} days</p>
                        <p><strong>Decoration Level:</strong> {selectedOrder.decor_level}%</p>
                      </>
                    )}
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Order Information</h4>
                  <p><strong>Total Amount:</strong> ${selectedOrder.total_amount}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Rush Order:</strong> {selectedOrder.rush_order ? 'Yes' : 'No'}</p>
                  {selectedOrder.installation_date && (
                    <p><strong>Installation Date:</strong> {new Date(selectedOrder.installation_date).toLocaleDateString()}</p>
                  )}
                  {selectedOrder.teardown_date && (
                    <p><strong>Teardown Date:</strong> {new Date(selectedOrder.teardown_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage