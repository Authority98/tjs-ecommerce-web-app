import React from 'react';
import { X, Calendar, Star, Wrench, Trash2, Truck, Zap, Building, FileText } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  order_type: 'product' | 'giftcard';
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  tree_height?: string;
  tree_type?: string;
  rental_period?: number;
  decor_level?: number;
  installation_charges?: number;
  teardown_charges?: number;
  rush_order?: boolean;
  rush_order_fee?: number;
  installation_date?: string;
  installation_time?: string;
  teardown_date?: string;
  teardown_time?: string;
  selected_delivery_addons?: Array<{
    id: string;
    name: string;
    fee: number;
  }>;
  products?: {
    id: string;
    title: string;
    category: string;
    images?: string[];
  };
  gift_cards?: {
    amount: number;
    sender_name: string;
    recipient_name: string;
    recipient_email: string;
    is_for_self: boolean;
    scheduled_date?: string;
    personal_message?: string;
  };
}

interface OrderSummaryModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getServiceChargeLabel = (type: string, date?: string, time?: string) => {
    const dateStr = date ? new Date(date).toLocaleDateString() : '';
    const timeStr = time || '';
    const isWeekend = date ? [0, 6].includes(new Date(date).getDay()) : false;
    
    return `${type} ${isWeekend ? '(Weekend)' : '(Weekday)'} ${dateStr} ${timeStr}`.trim();
  };

  const getAddOnIcon = (name: string) => {
    if (name.toLowerCase().includes('rush')) return <Zap className="w-4 h-4 text-purple-500 mr-2" />;
    if (name.toLowerCase().includes('lift') || name.toLowerCase().includes('access')) return <Building className="w-4 h-4 text-purple-500 mr-2" />;
    if (name.toLowerCase().includes('permit') || name.toLowerCase().includes('licensing')) return <FileText className="w-4 h-4 text-purple-500 mr-2" />;
    return <Truck className="w-4 h-4 text-purple-500 mr-2" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-pink-600 dark:text-rose-400">Order Summary</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Order #{order.order_number} • {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Product/Gift Card Display */}
          {order.order_type === 'giftcard' && order.gift_cards ? (
            <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="text-3xl">🎁</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">Gift Card</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Amount: ${order.gift_cards.amount}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <p>From: {order.gift_cards.sender_name}</p>
                  <p>To: {order.gift_cards.recipient_name}</p>
                </div>
              </div>
            </div>
          ) : order.products ? (
            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              {order.products.images && order.products.images.length > 0 ? (
                <img 
                  src={order.products.images[0]} 
                  alt={order.products.title}
                  className="w-16 h-16 object-cover rounded-lg border border-green-200 dark:border-green-700"
                />
              ) : (
                <div className="w-16 h-16 bg-green-200 dark:bg-green-700 rounded-lg flex items-center justify-center text-2xl">
                  🎄
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{order.products.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Customizations</p>
                {order.tree_height && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                    <p>{order.tree_height} • {order.tree_type}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Service Charges */}
          {order.order_type !== 'giftcard' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">Service Charges</h4>
              </div>
              <div className="space-y-3">
                {/* Full Decor */}
                {order.decor_level && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      Full Decor
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      Price to be determined
                    </span>
                  </div>
                )}
                
                {/* Rental Period */}
                {order.rental_period && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      Rental Period ({order.rental_period} days)
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      +$200
                    </span>
                  </div>
                )}
                
                {/* 5+ Workers Required - placeholder for now */}
                <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                    5+ Workers Required
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    +$250
                  </span>
                </div>
                
                {/* Assembly/Installation */}
                {order.installation_charges !== undefined && order.installation_charges > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      {getServiceChargeLabel('Assembly', order.installation_date, order.installation_time)}
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">+${order.installation_charges}</span>
                  </div>
                )}
                
                {/* Dismantling */}
                {order.teardown_charges !== undefined && order.teardown_charges > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      {getServiceChargeLabel('Dismantling', order.teardown_date, order.teardown_time)}
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">+${order.teardown_charges}</span>
                  </div>
                )}
                
                {/* Two-Way Delivery Trip */}
                <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                    Two-Way Delivery Trip
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    +$300
                  </span>
                </div>
                
                {/* Delivery Add-ons */}
                {order.selected_delivery_addons && order.selected_delivery_addons.length > 0 && (
                  order.selected_delivery_addons.map((addOn) => (
                    <div key={addOn.id} className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                      <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{addOn.name}</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">+${addOn.fee}</span>
                    </div>
                  ))
                )}
                
                {/* Rush Order */}
                {order.rush_order && order.rush_order_fee && order.rush_order_fee > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800 last:border-b-0">
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      Rush Order
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">+${order.rush_order_fee}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estimated Total */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border-2 border-pink-200 dark:border-rose-600">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Estimated Total</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-rose-400">${order.total_amount}</p>

            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Customer Information</h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <p><span className="font-medium">Name:</span> {order.customer_name}</p>
              <p><span className="font-medium">Email:</span> {order.customer_email}</p>
              {order.customer_phone && <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>}
              {order.customer_address && <p><span className="font-medium">Address:</span> {order.customer_address}</p>}
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                order.status === 'pending' ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100' :
                order.status === 'confirmed' ? 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100' :
                order.status === 'delivered' ? 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100' :
                'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;