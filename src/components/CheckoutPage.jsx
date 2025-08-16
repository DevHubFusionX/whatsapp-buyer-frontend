import { useState } from 'react'
import { ArrowLeft, CreditCard, Truck, MessageCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { buyerAPI } from '../services/api'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart') || '[]'))
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cod',
    notes: ''
  })

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 2000
  const grandTotal = total + deliveryFee

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Group items by vendor
      const ordersByVendor = cartItems.reduce((acc, item) => {
        const vendorId = item.vendor._id
        if (!acc[vendorId]) {
          acc[vendorId] = {
            vendor: item.vendor,
            items: [],
            total: 0
          }
        }
        acc[vendorId].items.push({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })
        acc[vendorId].total += item.price * item.quantity
        return acc
      }, {})

      // Create orders for each vendor
      const orderPromises = Object.values(ordersByVendor).map(order => 
        buyerAPI.createOrder({
          vendorId: order.vendor._id,
          buyerName: formData.name,
          buyerPhone: formData.phone,
          buyerEmail: formData.email,
          items: order.items,
          total: order.total,
          deliveryAddress: formData.address,
          notes: formData.notes
        })
      )

      const results = await Promise.all(orderPromises)
      
      // Send WhatsApp messages to vendors
      Object.values(ordersByVendor).forEach((order, index) => {
        const orderDetails = order.items.map(item => 
          `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`
        ).join('\n')
        
        const message = `🛍️ *NEW ORDER*\n\nCustomer: ${formData.name}\nPhone: ${formData.phone}\n\n${orderDetails}\n\n*Total: ₦${order.total.toLocaleString()}*\n\nDelivery Address:\n${formData.address}\n\nOrder ID: ${results[index].data.orderId}`
        
        const whatsappUrl = `https://wa.me/${order.vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
      })

      // Clear cart and redirect
      localStorage.removeItem('cart')
      navigate(`/order-tracking?phone=${formData.phone}`)
      
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Order failed. Please try again.')
    }
    
    setLoading(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some products to get started</p>
          <Link to="/" className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center space-x-3">
          <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <textarea
              name="notes"
              placeholder="Order Notes (optional)"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleInputChange}
                className="text-green-500"
              />
              <Truck className="w-5 h-5 text-gray-600" />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="transfer"
                checked={formData.paymentMethod === 'transfer'}
                onChange={handleInputChange}
                className="text-green-500"
              />
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span>Bank Transfer</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
        >
          <MessageCircle className="w-6 h-6" />
          <span>{loading ? 'Processing...' : 'Place Order via WhatsApp'}</span>
        </button>
      </form>
    </div>
  )
}

export default CheckoutPage