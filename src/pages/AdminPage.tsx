import React, { useState, useEffect } from 'react'
import { Plus, LogOut, Eye } from 'lucide-react'
import { Order } from '../types'
import { useAdminData } from '../hooks/useAdminData'
import ProductForm from '../components/ProductForm'
import LoadingSpinner from '../components/LoadingSpinner'
import AdminLogin from '../components/AdminLogin'
import { AdminStats, AdminProductsGrid, AdminOrdersTable, DiscountCodesManager } from '../components/admin'
import Button from '../components/ui/Button'
import { supabase } from '../lib/supabase'

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
    fetchOrders,
    deleteProduct,
    updateOrderStatus,
    handleLogout,
    
    // Stats
    stats
  } = useAdminData()

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'discounts'>('products')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Handle body scroll lock when modals are open
  useEffect(() => {
    if (showForm || selectedOrder) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showForm, selectedOrder])

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

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (error) throw error

      // Refresh orders data
      await fetchOrders()
      setSelectedOrder(null)
      
      // Show success message (you can implement toast notification here)
      alert('Order deleted successfully')
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order. Please try again.')
    }
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
          className="fixed z-10"
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
            className="hover:filter hover:brightness-125 transition-filter duration-300"
            style={{ 
              width: `${element.size}px`, 
              height: 'auto'
            }} 
          />
        </div>
      ))}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
              Admin Panel
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
              Admin Dashboard
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Manage your products and orders
            </p>
          </div>
          
          <Button
            variant="ghost"
            icon={LogOut}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl shadow-lg font-bold border-2 border-red-400 hover:border-red-500 transition-all duration-200"
          >
            Logout
          </Button>
        </div>

        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'discounts'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Discount Codes
          </button>
        </div>

        {/* Content */}
        {activeTab === 'products' && (
          <div
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white font-dosis">Products</h2>
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
          </div>
        )}

        {activeTab === 'orders' && (
          <div
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-dosis">Orders</h2>
            
            <AdminOrdersTable
              orders={orders}
              onUpdateOrderStatus={updateOrderStatus}
              onViewOrder={handleViewOrder}
            />
          </div>
        )}

        {activeTab === 'discounts' && (
          <div>
            <DiscountCodesManager />
          </div>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 bg-opacity-95 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProductForm
                product={editingProduct}
                onClose={handleFormClose}
              />
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 bg-opacity-95 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-t-3xl">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Order #{selectedOrder.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
                    Created on {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
                  >
                    Delete Order
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-500 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h4 className="font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Name:</span> {selectedOrder.customer_name}</p>
                    <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Email:</span> {selectedOrder.customer_email}</p>
                    <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Phone:</span> {selectedOrder.customer_phone}</p>
                    {selectedOrder.order_type !== 'giftcard' && (
                      <p className="text-gray-600 dark:text-gray-300 md:col-span-2"><span className="font-medium text-gray-800 dark:text-white">Address:</span> {selectedOrder.delivery_address}</p>
                    )}
                  </div>
                </div>
                
                {/* Order Type Specific Details */}
                {selectedOrder.order_type === 'giftcard' && selectedOrder.gift_cards ? (
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                    <h4 className="font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3 flex items-center">
                      <span className="text-2xl mr-2">🎁</span>
                      Gift Card Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Amount:</span> <span className="text-lg font-bold text-purple-600 dark:text-purple-400">${selectedOrder.gift_cards.amount}</span></p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">From:</span> {selectedOrder.gift_cards.sender_name}</p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">To:</span> {selectedOrder.gift_cards.recipient_name}</p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Recipient Email:</span> {selectedOrder.gift_cards.recipient_email}</p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">For Self:</span> {selectedOrder.gift_cards.is_for_self ? 'Yes' : 'No'}</p>
                      {selectedOrder.gift_cards.scheduled_date && (
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Scheduled Date:</span> {new Date(selectedOrder.gift_cards.scheduled_date).toLocaleDateString()}</p>
                      )}
                    </div>
                    {selectedOrder.gift_cards.personal_message && (
                      <div className="mt-4">
                        <p className="font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">Personal Message:</p>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                          <p className="text-sm italic text-gray-700 dark:text-gray-300">"{selectedOrder.gift_cards.personal_message}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : selectedOrder.products ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                    <h4 className="font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3 flex items-center">
                      <span className="text-2xl mr-2">🎄</span>
                      Product Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Product:</span> {selectedOrder.products.title}</p>
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Category:</span> {selectedOrder.products.category}</p>
                        {selectedOrder.tree_height && (
                          <>
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Size:</span> {selectedOrder.tree_height}</p>
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Type:</span> {selectedOrder.tree_type}</p>
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Rental Period:</span> {selectedOrder.rental_period} days</p>
                            <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Decoration Level:</span> {selectedOrder.decor_level}%</p>
                          </>
                        )}
                      </div>
                      {selectedOrder.products.images && selectedOrder.products.images.length > 0 && (
                        <div className="flex justify-center md:justify-end">
                          <img 
                            src={selectedOrder.products.images[0]} 
                            alt={selectedOrder.products.title}
                            className="w-32 h-32 object-cover rounded-xl border border-green-200 dark:border-green-700 shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Order Details</h4>
                    <p className="text-gray-500 dark:text-gray-400">No detailed information available for this order.</p>
                  </div>
                )}
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                  <h4 className="font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Order Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Total Amount:</span> <span className="text-lg font-bold text-green-600 dark:text-green-400">${selectedOrder.total_amount}</span></p>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center">
                      <span className="font-medium text-gray-800 dark:text-white mr-2">Status:</span> 
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedOrder.status === 'pending' ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100' :
                        selectedOrder.status === 'confirmed' ? 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100' :
                        selectedOrder.status === 'delivered' ? 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100' :
                        'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
                      }`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                    {selectedOrder.order_type !== 'giftcard' && (
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Rush Order:</span> {selectedOrder.rush_order ? 'Yes' : 'No'}</p>
                    )}
                    {selectedOrder.installation_date && (
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Installation Date:</span> {new Date(selectedOrder.installation_date).toLocaleDateString()}</p>
                    )}
                    {selectedOrder.teardown_date && (
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-800 dark:text-white">Teardown Date:</span> {new Date(selectedOrder.teardown_date).toLocaleDateString()}</p>
                    )}
                  </div>
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