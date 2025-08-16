import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, MessageCircle, Package, Plus, Minus, Shield, Truck, Clock } from 'lucide-react'
import { buyerAPI } from '../services/api'

const ModernProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await buyerAPI.getProduct(productId)
        setProduct(response.data)
        setVendor(response.data.vendor)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      }
      setLoading(false)
    }

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setWishlist(savedWishlist)
    setCartItems(savedCart)
    
    fetchProduct()
  }, [productId])

  const toggleWishlist = () => {
    const isInWishlist = wishlist.some(item => item._id === product._id)
    let newWishlist = isInWishlist 
      ? wishlist.filter(item => item._id !== product._id)
      : [...wishlist, product]
    
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
  }

  const addToCart = () => {
    const cartItem = { ...product, vendor, quantity }
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = existingCart.findIndex(item => item._id === product._id)
    
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    setCartItems(existingCart)
  }

  const handleContactVendor = () => {
    const message = `Hi! I'm interested in your product "${product.name}". Can you tell me more about it?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShare = () => {
    const shareText = `Check out this amazing product: ${product.name} - ₦${product.price.toLocaleString()}`
    
    if (navigator.share) {
      navigator.share({ title: product.name, text: shareText, url: window.location.href })
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
      alert('Product link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">This product may no longer be available</p>
        </div>
      </div>
    )
  }

  const isInWishlist = wishlist.some(item => item._id === product._id)
  const isInCart = cartItems.some(item => item._id === product._id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-20">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link to={`/catalog/${vendor?.catalogId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={toggleWishlist}
                className="p-2 hover:bg-red-50 rounded-full transition-colors"
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Product Images */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-4">
            <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100">
              {product.image ? (
                <div className="w-full h-full p-6 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-md" 
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No image available</p>
                  </div>
                </div>
              )}
              
              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.discount && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{product.discount}% OFF
                  </div>
                )}
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ✓ In Stock
                </div>
              </div>

              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Image Thumbnails (if multiple images) */}
          <div className="flex space-x-3 px-2">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-md border-2 border-green-500 overflow-hidden">
              {product.image ? (
                <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-2xl shadow-md flex items-center justify-center opacity-50">
              <span className="text-gray-400 text-xs">+2</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium">{product.rating || 4.5}</span>
                <span className="text-gray-500">({product.reviews || 12} reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600">{product.views || 0} views</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl font-bold text-green-600">₦{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {product.originalPrice && (
              <p className="text-green-600 font-medium">
                You save ₦{(product.originalPrice - product.price).toLocaleString()}
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">Authentic</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800">Fast Delivery</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-800">24/7 Support</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-2xl p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>
                <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total: <span className="font-bold text-green-600">₦{(product.price * quantity).toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Info */}
        {vendor && (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sold by</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                {vendor.logo ? (
                  <img src={vendor.logo} alt="Store" className="w-14 h-14 object-cover rounded-xl" />
                ) : (
                  <Package className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">{vendor.businessName}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{vendor.rating || 4.8}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">Verified Seller</span>
                </div>
              </div>
              <Link
                to={`/catalog/${vendor.catalogId}`}
                className="px-4 py-2 border border-green-500 text-green-600 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors"
              >
                View Store
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <button
            onClick={handleContactVendor}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Chat Seller</span>
          </button>
          
          <button
            onClick={addToCart}
            className="flex-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>{isInCart ? 'Update Cart' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-24"></div>
    </div>
  )
}

export default ModernProductDetail