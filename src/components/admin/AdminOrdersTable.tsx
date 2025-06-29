import React, { useState } from 'react'
import { Eye, Calendar, User, DollarSign, Package } from 'lucide-react'
import { Order } from '../../types'
import { Card } from '../ui'

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
      <Card className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Orders Found</h3>
        <p className="text-gray-500 dark:text-gray-500">Orders will appear here when customers place them.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div key={order.id}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{backgroundColor: 'rgba(147, 51, 233, 0.1)'}}>
                  <Package className="h-5 w-5" style={{color: '#9333E9'}} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Order #{order.order_number}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <button
                  onClick={() => onViewOrder(order)}
                  className="p-2 text-gray-500"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="font-medium text-gray-800 dark:text-white">{order.customer_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="font-medium text-gray-800 dark:text-white">${order.total_amount}</p>
                </div>
              </div>
              
              {order.installation_date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Installation</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {new Date(order.installation_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {order.order_type === 'giftcard' && order.gift_cards ? (
                // Gift Card Details
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🎁 Gift Card - ${order.gift_cards.amount}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <p><span className="font-medium">From:</span> {order.gift_cards.sender_name}</p>
                    <p><span className="font-medium">To:</span> {order.gift_cards.recipient_name}</p>
                    <p><span className="font-medium">Email:</span> {order.gift_cards.recipient_email}</p>
                    {order.gift_cards.scheduled_date && (
                      <p><span className="font-medium">Scheduled:</span> {new Date(order.gift_cards.scheduled_date).toLocaleDateString()}</p>
                    )}
                    {order.gift_cards.personal_message && (
                      <p className="col-span-full"><span className="font-medium">Message:</span> {order.gift_cards.personal_message}</p>
                    )}
                  </div>
                </div>
              ) : order.products ? (
                // Product Details
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product: {order.products.title}
                  </p>
                  {order.tree_height && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Size: {order.tree_height} | Type: {order.tree_type} | 
                      Rental: {order.rental_period} days | Decor: {order.decor_level}%
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Order details not available</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {(['pending', 'confirmed', 'delivered', 'completed'] as Order['status'][]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(order.id, status)}
                  disabled={order.status === status || updatingStatus === order.id}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === status
                    ? `${getStatusColor(status)} opacity-100`
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingStatus === order.id && order.status !== status ? (
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    status.charAt(0).toUpperCase() + status.slice(1)
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default AdminOrdersTable