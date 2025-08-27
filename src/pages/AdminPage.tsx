import React, { useState, useEffect } from 'react'
import { Plus, LogOut, MessageSquare } from 'lucide-react'
import { Order } from '../types'
import { useAdminData } from '../hooks/useAdminData'
import ProductForm from '../components/ProductForm'
import LoadingSpinner from '../components/LoadingSpinner'
import AdminLogin from '../components/AdminLogin'
import { AdminStats, AdminProductsGrid, AdminOrdersTable, DiscountCodesManager, DeliverySettings, InstallationChargesSettings, TimingSurchargesSettings } from '../components/admin'
import InquiriesManager from '../components/admin/InquiriesManager'
import OrderDetailsModal from '../components/OrderDetailsModal'
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
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'discounts' | 'settings' | 'inquiries'>('products')
  const [activeSettingsTab, setActiveSettingsTab] = useState<'delivery' | 'installation' | 'timing'>('delivery')
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

  // Helper function to check if a date is weekend
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  // Helper function to get service charge label with timing reasons
  const getServiceChargeLabel = (serviceType: string, dateString?: string, timeString?: string) => {
    let label = serviceType
    
    if (dateString && timeString) {
      const reasons = []
      
      // Check time type
      const timeType = timeString >= '18:00' ? (timeString >= '22:00' ? 'Late-night' : 'Evening') : null
      if (timeType) reasons.push(timeType)
      
      // Check if weekend
      const isWeekendDay = isWeekend(dateString)
      if (isWeekendDay) reasons.push('Weekend')
      
      if (reasons.length > 0) {
        label += ` (${reasons.join(', ')})`
      }
    }
    
    return label
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
            className={`px-3 sm:px-6 py-3 sm:py-4 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 sm:px-6 py-3 sm:py-4 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-3 sm:px-6 py-3 sm:py-4 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'discounts'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Discount Codes
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3 sm:px-6 py-3 sm:py-4 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'inquiries'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Inquiries
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 sm:px-6 py-3 sm:py-4 rounded-3xl font-bold border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Settings
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

        {activeTab === 'inquiries' && (
          <div>
            <InquiriesManager />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-dosis">Settings</h2>
            
            {/* Settings Submenu */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveSettingsTab('delivery')}
                className={`px-6 py-3 rounded-full font-medium border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-300 text-sm whitespace-nowrap ${
                  activeSettingsTab === 'delivery'
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300 dark:border-gray-700'
                }`}
              >
                Delivery Settings
              </button>
              <button
                onClick={() => setActiveSettingsTab('installation')}
                className={`px-6 py-3 rounded-full font-medium border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-300 text-sm whitespace-nowrap ${
                  activeSettingsTab === 'installation'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300 dark:border-gray-700'
                }`}
              >
                Installation/Teardown Charges
              </button>
              <button
                onClick={() => setActiveSettingsTab('timing')}
                className={`px-6 py-3 rounded-full font-medium border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transition-all duration-300 text-sm whitespace-nowrap ${
                  activeSettingsTab === 'timing'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300 dark:border-gray-700'
                }`}
              >
                Day Surcharges
              </button>
            </div>

            {/* Settings Content */}
            {activeSettingsTab === 'delivery' && <DeliverySettings />}
            {activeSettingsTab === 'installation' && <InstallationChargesSettings />}
            {activeSettingsTab === 'timing' && <TimingSurchargesSettings />}
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
          <OrderDetailsModal 
            isOpen={true}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
          />
        )}
      </div>
    </div>
  )
}

export default AdminPage