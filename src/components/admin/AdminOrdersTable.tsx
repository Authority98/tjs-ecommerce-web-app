import React, { useState } from 'react'
import { Eye, Calendar, User, DollarSign, Package } from 'lucide-react'
import { Order } from '../../types'
import { Card } from '../ui'
import { getCategoryConfig, CATEGORY_CONFIGS } from '../../utils/categories'

interface AdminOrdersTableProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
  onViewOrder: (order: Order) => void
}

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  orders,
  onUpdateOrderStatus,
  onViewOrder
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  // Function to get random gradient for each order
  const getOrderGradient = (index: number) => {
    const gradients = CATEGORY_CONFIGS.map(config => config.bgGradient)
    return gradients[index % gradients.length]
  }

  // Function to get category gradient for decorative elements
  const getCategoryGradient = (index: number) => {
    const gradients = CATEGORY_CONFIGS.map(config => config.gradient)
    return gradients[index % gradients.length]
  }

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    setUpdatingStatus(orderId)
    try {
      await onUpdateOrderStatus(orderId, status)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-yellow-900 border-yellow-300 dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-700'
      case 'confirmed': return 'bg-blue-200 text-blue-900 border-blue-300 dark:bg-blue-800 dark:text-blue-100 dark:border-blue-700'
      case 'delivered': return 'bg-purple-200 text-purple-900 border-purple-300 dark:bg-purple-800 dark:text-purple-100 dark:border-purple-700'
      case 'completed': return 'bg-green-200 text-green-900 border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-700'
      default: return 'bg-gray-200 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
    }
  }

  if (orders.length === 0) {
    return (
      <Card className="relative text-center py-12 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-white/20 dark:border-gray-700/30 backdrop-blur-xl bg-opacity-95 overflow-hidden">
        <div className="relative z-10">
          <div className="mx-auto mb-6 relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
              <Package className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No Orders Found</h3>
          <p className="text-gray-600 dark:text-gray-300">Orders will appear here when customers place them.</p>
        </div>
        
        {/* Decorative Elements */}
         <div className="absolute top-4 right-4">
           <div className="w-16 h-16 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-xl opacity-40" />
         </div>
         <div className="absolute bottom-4 left-4">
           <div className="w-12 h-12 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-lg opacity-35" />
         </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div key={order.id}>
          <Card className={`relative p-6 bg-gradient-to-br ${getOrderGradient(index)} border border-white/20 dark:border-gray-700/30 backdrop-blur-xl bg-opacity-95 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                   <div className={`w-16 h-16 bg-gradient-to-r ${getCategoryGradient(index)} rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30`}>
                     <Package className="h-8 w-8 text-white" />
                   </div>
                   {/* Sparkle effect */}
                   <div className="absolute -top-1 -right-1">
                     <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                   </div>
                 </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    Order #{order.order_number}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)} shadow-md`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <button
                  onClick={() => onViewOrder(order)}
                  className="p-3 text-gray-700 dark:text-white hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/30"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30 shadow-sm">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">Customer</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{order.customer_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-300/30 shadow-sm">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">Total</p>
                  <p className="font-bold text-green-700 dark:text-green-400 text-xl">${order.total_amount}</p>
                </div>
              </div>
              
              {order.installation_date && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-300/30 shadow-sm">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">Installation</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {new Date(order.installation_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="mb-4 p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl border border-white/40 backdrop-blur-sm">
              {order.order_type === 'giftcard' && order.gift_cards ? (
                // Gift Card Details
                <div>
                  <p className="text-base font-bold text-gray-800 dark:text-white mb-3">
                    🎁 Gift Card - ${order.gift_cards.amount}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-200">
                    <p><span className="font-bold text-gray-900 dark:text-white">From:</span> {order.gift_cards.sender_name}</p>
                    <p><span className="font-bold text-gray-900 dark:text-white">To:</span> {order.gift_cards.recipient_name}</p>
                    <p><span className="font-bold text-gray-900 dark:text-white">Email:</span> {order.gift_cards.recipient_email}</p>
                    {order.gift_cards.scheduled_date && (
                      <p><span className="font-bold text-gray-900 dark:text-white">Scheduled:</span> {new Date(order.gift_cards.scheduled_date).toLocaleDateString()}</p>
                    )}
                    {order.gift_cards.personal_message && (
                      <p className="col-span-full"><span className="font-bold text-gray-900 dark:text-white">Message:</span> {order.gift_cards.personal_message}</p>
                    )}
                  </div>
                </div>
              ) : order.products ? (
                // Product Details
                <div>
                  <p className="text-base font-bold text-gray-800 dark:text-white">
                    Product: {order.products.title}
                  </p>
                  {order.tree_height && (
                    <p className="text-sm text-gray-700 dark:text-gray-200 mt-2 font-semibold">
                      Size: {order.tree_height} | Type: {order.tree_type} | 
                      Rental: {order.rental_period} days | Decor: {order.decor_level}%
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">Order details not available</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {(['pending', 'confirmed', 'delivered', 'completed'] as Order['status'][]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(order.id, status)}
                  disabled={order.status === status || updatingStatus === order.id}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-200 shadow-md hover:shadow-lg ${
                  order.status === status
                    ? `${getStatusColor(status)} opacity-100 scale-105`
                    : 'bg-white/50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingStatus === order.id && order.status !== status ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    status.charAt(0).toUpperCase() + status.slice(1)
                  )}
                </button>
              ))}
            </div>

             {/* Decorative Elements */}
             <div className="absolute top-4 right-4">
               <div className="w-16 h-16 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-xl opacity-40" />
             </div>
             <div className="absolute bottom-4 left-4">
               <div className="w-12 h-12 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-lg opacity-35" />
             </div>
           </Card>
        </div>
      ))}
    </div>
  )
}

export default AdminOrdersTable