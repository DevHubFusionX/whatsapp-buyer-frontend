import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageCircle, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { buyerAPI } from '../services/api'

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [trackingInput, setTrackingInput] = useState({
    phone: searchParams.get('phone') || '',
    orderId: searchParams.get('orderId') || ''
  })

  const trackOrder = async () => {
    if (!trackingInput.phone && !trackingInput.orderId) return
    
    setLoading(true)
    try {
      const response = await buyerAPI.trackOrder(trackingInput)
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to track order:', error)
      setOrders([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (trackingInput.phone || trackingInput.orderId) {
      trackOrder()
    }
  }, [])

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle
    }
    const Icon = icons[status] || Clock
    return <Icon className="w-5 h-5" />
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      processing: 'text-blue-600',
      shipped: 'text-purple-600',
      delivered: 'text-green-600'
    }
    return colors[status] || 'text-gray-600'
  }

  const getProgressSteps = (currentStatus) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: CheckCircle },
      { key: 'processing', label: 'Processing', icon: Package },
      { key: 'shipped', label: 'On the Way', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ]

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered']
    const currentIndex = statusOrder.indexOf(currentStatus)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }))
  }

  const handleContactVendor = (order) => {
    const message = `Hi! I'm checking on my order (Order ID: ${order._id}). Can you please provide an update?`
    const whatsappUrl = `https://wa.me/${order.vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          
          {/* Tracking Form */}
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={trackingInput.phone}
              onChange={(e) => setTrackingInput(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Or enter Order ID (optional)"
              value={trackingInput.orderId}
              onChange={(e) => setTrackingInput(prev => ({ ...prev, orderId: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={trackOrder}
              disabled={loading || (!trackingInput.phone && !trackingInput.orderId)}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Tracking your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Enter your phone number or order ID to track your orders</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const progressSteps = getProgressSteps(order.status)
              
              return (
                <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        From {order.vendor?.businessName || 'Vendor'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ₦{order.total.toLocaleString()}
                      </p>
                      <div className={`flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      {progressSteps.map((step, index) => {
                        const Icon = step.icon
                        return (
                          <div key={step.key} className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                              step.completed 
                                ? 'bg-green-500 text-white' 
                                : step.active 
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs text-center font-medium ${
                              step.completed || step.active ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                            {index < progressSteps.length - 1 && (
                              <div className={`absolute h-0.5 w-full mt-5 ${
                                step.completed ? 'bg-green-500' : 'bg-gray-200'
                              }`} style={{ 
                                left: '50%', 
                                right: '-50%',
                                zIndex: -1
                              }} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address:</h4>
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>

                  {/* Contact Vendor */}
                  <button
                    onClick={() => handleContactVendor(order)}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact Vendor</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTrackingPage