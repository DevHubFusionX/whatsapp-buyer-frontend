import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaArrowLeft, FaWhatsapp, FaStore, FaShoppingCart, FaShare, FaTruck, FaPhone } from 'react-icons/fa'
import { MdSecurity } from 'react-icons/md'
import { buyerAPI } from '../services/api'

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await buyerAPI.getProduct(productId)
        setProduct(response.data)
        
        const vendorsRes = await buyerAPI.getVendors()
        const vendorInfo = vendorsRes.data.find(v => v._id === response.data.vendorId)
        setVendor(vendorInfo)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [productId])

  const contactVendor = () => {
    const message = `Hi ${vendor?.businessName}! I want to order ${quantity}x "${product.name}" for ₦${(product.price * quantity)?.toLocaleString()}.`
    const whatsappUrl = `https://wa.me/${vendor?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item._id === product._id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    navigate('/cart')
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} for ₦${product.price?.toLocaleString()}`,
        url: window.location.href
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    )
  }

  const images = product.images || [product.image].filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
          <FaArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <div className="flex items-center space-x-3">
          <button onClick={shareProduct} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
            <FaShare className="w-4 h-4 text-gray-700" />
          </button>
          <button onClick={() => setIsSaved(!isSaved)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
            <FaHeart className={`w-4 h-4 ${isSaved ? 'text-red-500' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="pt-20">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          {images.length > 0 ? (
            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
          )}
          
          {/* Image indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-6 py-6 space-y-6">
        {/* Title & Price */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl font-bold text-blue-600">₦{product.price?.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">₦{product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          
          {/* Rating & Reviews */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-gray-600 ml-2">4.8 (124 reviews)</span>
            </div>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">✓ In Stock</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <FaTruck className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <span className="text-xs text-gray-600">Fast Delivery</span>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <MdSecurity className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <span className="text-xs text-gray-600">Quality Assured</span>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <FaPhone className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <span className="text-xs text-gray-600">24/7 Support</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Quantity Selector */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-200 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-xl"
              >
                -
              </button>
              <span className="w-16 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-xl"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">Total: ₦{(product.price * quantity)?.toLocaleString()}</span>
          </div>
        </div>

        {/* Vendor Card */}
        {vendor && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <FaStore className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{vendor.businessName}</h4>
                  <div className="flex items-center space-x-1">
                    <FaStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.9 • 500+ products</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/store/${vendor._id}`)}
                className="bg-white text-blue-600 px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                Visit Store
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <div className="flex space-x-3">
          <button
            onClick={addToCart}
            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={contactVendor}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span>Order Now</span>
          </button>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-24"></div>
    </div>
  )
}

export default ProductDetail