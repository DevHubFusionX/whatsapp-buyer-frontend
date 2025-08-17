import { useState } from 'react'
import { ShoppingCart, X, MessageCircle, Minus, Plus, Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { buyerAPI } from '../../services/api'

const FloatingCart = ({ items = [], onUpdateQuantity, onRemoveItem, vendor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    // Log interaction for each product
    try {
      const buyerId = localStorage.getItem('buyerId')
      if (buyerId && items.length > 0) {
        for (const item of items) {
          await buyerAPI.logInteraction({
            buyerId,
            vendorId: vendor._id,
            productId: item._id,
            action: 'MessageVendor',
            timestamp: new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Failed to log interactions:', error)
    }

    const orderDetails = items.map(item => 
      `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n')
    
    const message = `🛍️ *ORDER REQUEST*\n\n${orderDetails}\n\n*Total: ₦${totalPrice.toLocaleString()}*\n\nPlease confirm availability and delivery details.`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (totalItems === 0) return null

  return (
    <>
      {/* Enhanced Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:from-green-600 hover:to-green-700"
        >
          <ShoppingCart className="w-7 h-7" />
          {totalItems > 0 && (
            <>
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
                {totalItems}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl animate-ping opacity-20"></div>
            </>
          )}
        </button>
        
        {/* Quick View Button */}
        <button
          onClick={() => navigate('/cart')}
          className="mt-3 w-12 h-12 bg-white text-green-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-green-100"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Enhanced Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-300">
          <div className="bg-white w-full max-h-[85vh] rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Enhanced Header */}
            <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your Order</h2>
                    <p className="text-white/80 text-sm">{totalItems} items • ₦{totalPrice.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Enhanced Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
              {items.map((item, index) => (
                <div key={item._id} className="group flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-white rounded-3xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-green-600 transition-colors">{item.name}</h3>
                    <p className="text-green-600 font-bold text-lg">₦{item.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">₦{(item.price * item.quantity).toLocaleString()} total</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white rounded-2xl p-2 shadow-sm">
                      <button
                        onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                        className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item._id)}
                      className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 hover:scale-110 transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-t border-gray-100 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-3xl font-bold flex items-center justify-center space-x-3 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Order via WhatsApp</span>
                  <Sparkles className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    setIsOpen(false)
                    navigate('/cart')
                  }}
                  className="w-full bg-white text-green-600 py-4 rounded-3xl font-semibold border-2 border-green-200 hover:bg-green-50 transition-all duration-200"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingCart