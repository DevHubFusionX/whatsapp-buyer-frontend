import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([])
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setWishlist(savedWishlist)
    setCartItems(savedCart)
  }, [])

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item._id !== productId)
    setWishlist(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const addToCart = (product) => {
    const cartItem = { ...product, quantity: 1 }
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    const existingIndex = existingCart.findIndex(item => item._id === product._id)
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    setCartItems(existingCart)
  }

  const moveToCart = (product) => {
    addToCart(product)
    removeFromWishlist(product._id)
  }

  const clearWishlist = () => {
    setWishlist([])
    localStorage.removeItem('wishlist')
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId)
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
            <h1 className="text-lg font-semibold text-gray-900">My Wishlist</h1>
          </div>
          
          {wishlist.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{wishlist.length} items saved</p>
              <button
                onClick={clearWishlist}
                className="text-red-600 text-sm font-medium hover:text-red-700"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
            <Link
              to="/"
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <p className="text-green-600 font-bold text-xl">₦{product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-gray-400 text-sm line-through">₦{product.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{product.views || 0} views</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isInCart(product._id) ? (
                        <Link
                          to="/cart"
                          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl text-sm font-medium text-center hover:bg-blue-600 transition-colors"
                        >
                          View in Cart
                        </Link>
                      ) : (
                        <button
                          onClick={() => moveToCart(product)}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Move to Cart</span>
                        </button>
                      )}
                      
                      <Link
                        to={`/catalog/${product.vendor?.catalogId || 'unknown'}`}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        View Store
                      </Link>
                    </div>
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

export default WishlistPage