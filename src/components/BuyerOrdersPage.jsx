import { useState, useEffect } from 'react'
import { FaArrowLeft, FaWhatsapp, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'

const BuyerOrdersPage = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock orders data - replace with actual API call
    const mockOrders = [
      {
        id: '1',
        items: [{ name: 'iPhone 13', quantity: 1, price: 450000 }],
        total: 450000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        vendorPhone: '+2348123456789'
      },
      {
        id: '2',
        items: [{ name: 'Nike Sneakers', quantity: 2, price: 25000 }],
        total: 50000,
        status: 'delivered',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        vendorPhone: '+2348123456789'
      }
    ]
    
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.pending
  }

  const contactVendor = (order) => {
    const message = `Hi! I'd like to check on my order #${order.id}`
    const whatsappUrl = `https://wa.me/${order.vendorPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">My Orders</h1>
          <div></div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{item.name} x{item.quantity}</span>
                      <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-lg font-bold text-green-600">₦{order.total.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => contactVendor(order)}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300">
                      <FaEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default BuyerOrdersPage