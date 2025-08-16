import { useState, useEffect } from 'react'
import { Search, Package, Clock, CheckCircle, XCircle, MessageCircle, ArrowLeft, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'

const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [userPhone, setUserPhone] = useState('')

  useEffect(() => {
    const savedPhone = localStorage.getItem('buyerPhone')
    if (savedPhone) {
      setUserPhone(savedPhone)
      fetchOrders(savedPhone)
    } else {
      // Prompt for phone number
      const phone = prompt('Enter your phone number to view orders:')
      if (phone) {
        localStorage.setItem('buyerPhone', phone)
        setUserPhone(phone)
        fetchOrders(phone)
      } else {
        setLoading(false)
      }
    }
  }, [])

  const fetchOrders = async (phone) => {
    try {
      const response = await buyerAPI.trackOrder({ phone })
      setOrders(response.data)
      setFilteredOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
      setFilteredOrders([])
    }
    setLoading(false)
  }

  useEffect(() => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vendor?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: Package,
      delivered: CheckCircle,
      cancelled: XCircle
    }
    const Icon = icons[status] || Clock
    return <Icon className="w-4 h-4" />
  }

  const handleContactVendor = (order) => {
    const message = `Hi! I'm checking on my order #${order._id.slice(-6)}. Can you please provide an update?`
    const whatsappUrl = `https://wa.me/${order.vendor.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const changePhoneNumber = () => {
    const newPhone = prompt('Enter your phone number:', userPhone)
    if (newPhone && newPhone !== userPhone) {
      localStorage.setItem('buyerPhone', newPhone)
      setUserPhone(newPhone)
      setLoading(true)
      fetchOrders(newPhone)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!userPhone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Phone Number Required</h2>
          <p className="text-gray-600 mb-6">We need your phone number to show your orders</p>
          <button
            onClick={changePhoneNumber}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            Enter Phone Number
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">My Orders</h1>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{userPhone}</span>
                <button
                  onClick={changePhoneNumber}
                  className="text-green-600 text-sm hover:text-green-700"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['pending', 'processing', 'delivered', 'cancelled'].map(status => {
            const count = orders.filter(order => order.status === status).length
            return (
              <div key={status} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{status}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t placed any orders yet'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                to="/"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{order.vendor?.businessName || 'Unknown Store'}</span>
                      <span>•</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₦{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.name} x{item.quantity}</span>
                        <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-500">+{order.items.length - 3} more items</p>
                    )}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Delivery Address:</strong> {order.deliveryAddress}
                    </p>
                  </div>
                )}

                {order.notes && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Notes:</strong> {order.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                        Reorder
                      </button>
                    )}
                    
                    {order.status === 'pending' && (
                      <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                        Cancel Order
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/catalog/${order.vendor?.catalogId}`}
                      className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Visit Store
                    </Link>
                    
                    {order.vendor?.phoneNumber && (
                      <button
                        onClick={() => handleContactVendor(order)}
                        className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}

export default BuyerOrdersPage