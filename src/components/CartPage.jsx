import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa'
import Layout from './Layout'

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }, [])

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }
    
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Shopping Cart</h1>
            <div></div>
          </div>
          
          <div className="text-center py-12">
            <FaShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started</p>
            <Link to="/home" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
              Continue Shopping
            </Link>
          </div>
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
          <h1 className="text-lg font-semibold">Shopping Cart ({cartItems.length})</h1>
          <div></div>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-green-600 font-bold text-lg">₦{item.price?.toLocaleString()}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total and Checkout */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-green-600">₦{getTotalPrice().toLocaleString()}</span>
          </div>
          
          <Link
            to="/checkout"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-center block"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default CartPage