import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Heart, Star, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(savedCart)
  }, [])

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeItem(productId)
      return
    }

    const updatedCart = cartItems.map(item => 
      item._id === productId ? { ...item, quantity } : item
    )
    
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartItems(updatedCart)
  }

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartItems(updatedCart)
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 2000
  const grandTotal = total + deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-gray-100">
          <div className="p-4 flex items-center space-x-3">
            <Link to="/" className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Shopping Cart</h1>
            </div>
          </div>
        </div>
        
        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[70vh] p-4">
          <div className="text-center max-w-md">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">Discover amazing products from local vendors and start shopping!</p>
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-3xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Shopping Cart</h1>
            </div>
          </div>
          <div className="bg-green-100 px-3 py-2 rounded-2xl">
            <span className="text-sm font-semibold text-green-700">{cartItems.length} items</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-8">
        {/* Enhanced Cart Items - Responsive */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="group bg-white rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-600 transition-colors truncate">{item.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-600 font-medium truncate">{item.vendor?.businessName}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">₦{item.price.toLocaleString()}</p>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Mobile Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl p-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Product Image */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ShoppingCart className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-600 transition-colors">{item.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{item.vendor?.businessName}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="text-xl font-bold text-green-600">₦{item.price.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end space-y-4">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Order Summary - Responsive */}
        <div className="bg-white rounded-3xl p-4 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Order Summary</h2>
          </div>
          
          <div className="space-y-3 md:space-y-4 mb-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm md:text-base text-gray-600">Subtotal ({cartItems.length} items)</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm md:text-base text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg md:text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl md:text-2xl font-bold text-green-600">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 md:py-5 rounded-3xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Proceed to Checkout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage