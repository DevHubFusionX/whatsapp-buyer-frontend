import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaArrowLeft, FaWhatsapp, FaStore } from 'react-icons/fa'
import { buyerAPI } from '../services/api'

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await buyerAPI.getProduct(productId)
        setProduct(response.data)
        
        // Fetch vendor info
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
    const message = `Hi ${vendor?.businessName || 'there'}! I'm interested in "${product.name}" for ₦${product.price?.toLocaleString()}.`
    const whatsappUrl = `https://wa.me/${vendor?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const toggleSave = () => {
    setIsSaved(!isSaved)
    // Add to wishlist logic here
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FaArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{vendor?.businessName || 'Store'}</h1>
        <div className="w-10" />
      </div>

      {/* Hero Image */}
      <div className="relative mx-4">
        <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-lg">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
          )}
        </div>
        <button 
          onClick={toggleSave}
          className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <FaHeart className={`w-5 h-5 ${isSaved ? 'text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Product Info Card */}
      <div className="p-6 -mt-8 bg-white rounded-3xl shadow-xl mx-4 relative z-10 flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
        <p className="text-3xl font-bold text-green-600 mb-4">₦{product.price?.toLocaleString()}</p>
        
        {product.description && (
          <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
        )}
        
        <div className="flex items-center space-x-2 mb-6">
          <span className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium">
            ✅ In Stock
          </span>
          <div className="flex items-center space-x-1">
            <FaStar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600 font-medium">4.8 (124 reviews)</span>
          </div>
        </div>

        {/* Vendor Info */}
        {vendor && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaStore className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vendor.businessName}</p>
                  <p className="text-sm text-gray-600">{vendor.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/store/${vendor._id}`)}
                className="text-green-600 text-sm font-medium hover:text-green-700"
              >
                View Store
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky WhatsApp CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-2xl">
        <div>
          <p className="text-sm text-gray-600">Price</p>
          <p className="text-xl font-bold text-gray-900">₦{product.price?.toLocaleString()}</p>
        </div>
        <button
          onClick={contactVendor}
          className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <FaWhatsapp className="w-5 h-5" />
          Order on WhatsApp
        </button>
      </div>

      {/* Bottom padding for sticky bar */}
      <div className="h-24"></div>
    </div>
  )
}

export default ProductDetail