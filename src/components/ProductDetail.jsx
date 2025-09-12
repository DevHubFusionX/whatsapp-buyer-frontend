import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaArrowLeft, FaWhatsapp, FaStore, FaShoppingCart, FaShare, FaTruck, FaPhone } from 'react-icons/fa'
import { MessageCircle, Phone, Share2, Heart, ShoppingBag, Truck, Shield, Clock, Star, ChevronLeft, ChevronRight, Zap, Award, Users } from 'lucide-react'
import { buyerAPI } from '../services/api'
import { shareProduct } from '../utils/share'
import GuestPrompt from './GuestPrompt'
import WhatsAppHelper from './ui/WhatsAppHelper'

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showWhatsAppHelper, setShowWhatsAppHelper] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    const hasSeenProductHelper = localStorage.getItem('hasSeenProductHelper')
    if (!hasSeenProductHelper) {
      setShowWhatsAppHelper(true)
      localStorage.setItem('hasSeenProductHelper', 'true')
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('buyerToken')
    setIsLoggedIn(!!token)
  }, [])

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

  const orderOnWhatsApp = () => {
    const message = `Hi, I'm interested in "${product.name}" (₦${product.price?.toLocaleString()}).`
    const vendorPhone = product.vendor?.phoneNumber || vendor?.phoneNumber
    const whatsappUrl = `https://wa.me/${vendorPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
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

  const handleShareProduct = async () => {
    const result = await shareProduct(product)
    if (result.success && result.method === 'clipboard') {
      alert('Product link copied to clipboard!')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleShareProduct} 
            className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => setIsSaved(!isSaved)} 
            className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      {/* Enhanced Product Images */}
      <div className="pt-20 px-4">
        <div className="max-w-md mx-auto aspect-square bg-gradient-to-br from-gray-100 via-white to-gray-100 relative overflow-hidden rounded-2xl shadow-lg">
          {images.length > 0 ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-24 h-24 text-gray-300" />
            </div>
          )}
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}
          
          {/* Enhanced Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === selectedImage 
                      ? 'bg-white shadow-lg scale-125' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Product Info */}
      <div className="px-6 py-8 space-y-8">
        {/* Title & Price */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ₦{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex flex-col">
                <span className="text-lg text-gray-400 line-through">₦{product.originalPrice?.toLocaleString()}</span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            )}
          </div>
          
          {/* Enhanced Rating & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-2 rounded-full">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm font-semibold text-yellow-700 ml-2">4.8</span>
              </div>
              <span className="text-sm text-gray-600">(124 reviews)</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">In Stock</span>
            </div>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 hover:scale-105 transition-transform">
            <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-700">Fast Delivery</span>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200/50 hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-700">Quality Assured</span>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200/50 hover:scale-105 transition-transform">
            <Phone className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-700">Direct Contact</span>
          </div>
        </div>

        {/* WhatsApp Helper */}
        {showWhatsAppHelper && (
          <WhatsAppHelper 
            vendor={vendor}
            product={product}
            className="mb-6"
          />
        )}
        
        {/* Enhanced Description */}
        {product.description && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Product Details
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
          </div>
        )}



        {/* Enhanced Vendor Card */}
        {vendor && (
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center border border-white/30">
                    <FaStore className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{vendor.businessName}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        <span className="text-white/90 font-medium">4.9</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-white/80" />
                        <span className="text-white/90">500+ products</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate(`/store/${vendor._id}`)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FaStore className="w-4 h-4" />
                  <span>Visit Store</span>
                </button>
                <button
                  onClick={() => {
                    const phoneNumber = vendor.phoneNumber?.replace(/\D/g, '')
                    if (phoneNumber) window.open(`tel:${phoneNumber}`, '_blank')
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 p-4 shadow-2xl">
        <div className="flex space-x-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
              isSaved 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={orderOnWhatsApp}
            className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-lg">Order on WhatsApp</span>
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-24"></div>
    </div>
  )
}

export default ProductDetail