import { useState } from 'react'
import { ArrowLeft, CreditCard, Truck, MessageCircle, ShoppingCart, Sparkles, MapPin, User, Phone, Mail } from 'lucide-react'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-3xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            <ShoppingCart className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4 flex items-center space-x-3">
          <Link to="/cart" className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Checkout</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 pb-8">
        {/* Enhanced Order Summary */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <ShoppingCart className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-gray-900">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">₦{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Customer Details */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            
            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors resize-none"
              />
            </div>
            
            <textarea
              name="notes"
              placeholder="Order Notes (optional)"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors resize-none"
            />
          </div>
        </div>

        {/* Enhanced Payment Method */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
          </div>
          
          <div className="space-y-4">
            <label className={`flex items-center space-x-4 p-6 border-2 rounded-3xl cursor-pointer transition-all duration-200 ${
              formData.paymentMethod === 'cod' 
                ? 'border-green-500 bg-green-50 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleInputChange}
                className="text-green-500 w-5 h-5"
              />
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Cash on Delivery</span>
                <p className="text-sm text-gray-600">Pay when you receive your order</p>
              </div>
            </label>
            
            <label className={`flex items-center space-x-4 p-6 border-2 rounded-3xl cursor-pointer transition-all duration-200 ${
              formData.paymentMethod === 'transfer' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="transfer"
                checked={formData.paymentMethod === 'transfer'}
                onChange={handleInputChange}
                className="text-blue-500 w-5 h-5"
              />
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Bank Transfer</span>
                <p className="text-sm text-gray-600">Pay via bank transfer or mobile money</p>
              </div>
            </label>
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-6 rounded-3xl font-bold flex items-center justify-center space-x-3 hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-6 h-6" />
                <span>Place Order via WhatsApp</span>
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Your order will be sent directly to the vendor via WhatsApp
          </p>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage