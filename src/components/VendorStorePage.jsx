import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaSearch, FaStar, FaShoppingBag, FaHeart, FaArrowLeft, FaWhatsapp, FaShare, FaFilter, FaShieldAlt, FaInfoCircle } from 'react-icons/fa'
import { MessageCircle, Phone, MapPin, Clock, Grid, List, HelpCircle, Store, Users, Award, CheckCircle, Info, Star, Zap, Shield, Truck } from 'lucide-react'
import { MdVerified, MdInfo, MdTrendingUp } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { buyerAPI, vendorsAPI } from '../services/api'
import Layout from './Layout'
import WhatsAppHelper from './ui/WhatsAppHelper'

const VendorStorePage = () => {
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showWhatsAppHelper, setShowWhatsAppHelper] = useState(false)
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    const hasSeenHelper = localStorage.getItem('hasSeenStoreHelper')
    if (!hasSeenHelper) {
      setShowWhatsAppHelper(true)
      localStorage.setItem('hasSeenStoreHelper', 'true')
    }
  }, [])

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        // Get vendor info by vendor ID
        const vendorRes = await vendorsAPI.getVendorById(vendorId)
        const vendorInfo = vendorRes.data
        setVendor(vendorInfo)
        
        // Then get products for this vendor
        const productsRes = await buyerAPI.getProducts({ vendor: vendorId })
        setProducts(productsRes.data)
        setFilteredProducts(productsRes.data)
      } catch (error) {
        console.error('Failed to fetch vendor data:', error)
      }
      setLoading(false)
    }
    
    fetchVendorData()
  }, [vendorId])

  useEffect(() => {
    let filtered = products
    
    if (searchQuery.trim()) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })
    
    setFilteredProducts(filtered)
  }, [searchQuery, products, sortBy])

  const handleContactVendor = () => {
    const message = `Hi! I'm browsing your store and interested in your products. Can you help me find what I'm looking for?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShareStore = () => {
    const storeUrl = window.location.href
    if (navigator.share) {
      navigator.share({
        title: `${vendor.businessName} - Product Store`,
        text: `Check out ${vendor.businessName}'s amazing products!`,
        url: storeUrl
      })
    } else {
      navigator.clipboard.writeText(storeUrl)
      alert('Store link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  if (!vendor) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <p className="text-gray-600">Store not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Enhanced Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all transform hover:scale-105"
            >
              <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="font-bold text-gray-900 text-sm sm:text-base">Professional Store</h1>
              <p className="text-xs text-gray-500">Verified Vendor</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShareStore}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all transform hover:scale-105"
              >
                <FaShare className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowWhatsAppHelper(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 hover:bg-blue-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all transform hover:scale-105"
              >
                <HelpCircle className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Vendor Info */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/30 mx-auto sm:mx-0 relative">
                {vendor.logo ? (
                  <img src={vendor.logo} alt={vendor.businessName} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl" />
                ) : (
                  <FaShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <MdVerified className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{vendor.businessName}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3 space-y-2 sm:space-y-0">
                  <div className="flex items-center justify-center sm:justify-start space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-white font-medium">{vendor.rating || 4.8}</span>
                    <span className="text-white/80 text-sm">(150+ reviews)</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <Store className="w-4 h-4 text-white/80" />
                    <span className="text-white text-sm">{filteredProducts.length} products</span>
                  </div>
                </div>
                
                {/* Store Features */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Professional</span>
                  </span>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>Fast Response</span>
                  </span>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>Delivery Available</span>
                  </span>
                </div>
                
                {vendor.description && (
                  <p className="text-white/90 text-sm leading-relaxed">{vendor.description}</p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleContactVendor}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  const phoneNumber = vendor.phoneNumber?.replace(/\D/g, '')
                  if (phoneNumber) window.open(`tel:${phoneNumber}`, '_blank')
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span>Call Vendor</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Store Guide */}
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 text-sm mb-1">💬 How to Shop from This Store</h3>
              <p className="text-xs sm:text-sm text-blue-700">Browse products below, then click "Order Now" to chat with the vendor on WhatsApp. Ask about availability, sizes, colors, and delivery options!</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Helper */}
        {showWhatsAppHelper && (
          <div className="p-4 bg-green-50">
            <WhatsAppHelper 
              vendor={vendor}
              className="mb-4"
            />
            <button
              onClick={() => setShowWhatsAppHelper(false)}
              className="w-full text-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
            >
              Got it! Hide Helper
            </button>
          </div>
        )}
        
        {/* Enhanced Search & Filters */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`🔍 Search products in ${vendor.businessName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm hover:shadow-md transition-all text-sm sm:text-base"
            />
          </div>
          
          {/* Sort & View Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MdTrendingUp className="w-4 h-4" />
                <span>{filteredProducts.length} items</span>
              </div>
            </div>
            
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Products Section */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Store className="w-5 h-5 mr-2 text-blue-600" />
                Store Products
              </h3>
              <p className="text-sm text-gray-600">{filteredProducts.length} items available • All verified quality</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Inventory</span>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No products match "${searchQuery}"` : 'This store has no products yet'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredProducts.map((product) => (
                <ListProductCard key={product._id} product={product} vendor={vendor} />
              ))}
            </div>
          )}
          
          {/* Shopping Tips */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-200/50">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                💡 Shopping Tips for This Store
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">Ask About Bulk Orders</h5>
                    <p className="text-xs text-gray-600 mt-1">This vendor offers discounts for multiple items</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">Delivery Options</h5>
                    <p className="text-xs text-gray-600 mt-1">Ask about same-day delivery in your area</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

// Enhanced Product Card Component
const ProductCard = ({ product, vendor }) => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault()
    const message = `Hi ${vendor.businessName}! I'm interested in *${product.name}* for ₦${product.price?.toLocaleString()}. Is it available? Can you tell me more about it?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-green-200">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FaShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            In Stock
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault()
              // Add to favorites logic
            }}
            className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        <div className="p-3 sm:p-4">
          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">{product.name}</h4>
          <div className="flex items-center justify-between mb-3">
            <p className="text-base sm:text-lg font-bold text-green-600">₦{product.price?.toLocaleString()}</p>
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
              <FaStar className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-700 font-medium">4.5</span>
            </div>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

// List View Product Card
const ListProductCard = ({ product, vendor }) => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault()
    const message = `Hi ${vendor.businessName}! I'm interested in *${product.name}* for ₦${product.price?.toLocaleString()}. Is it available? Can you tell me more about it?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 p-3 sm:p-4 border border-gray-100 hover:border-green-200">
        <div className="flex space-x-3 sm:space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FaShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
            <div className="absolute top-1 left-1 bg-green-500 text-white px-1 py-0.5 rounded text-xs font-medium">
              ✓
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">{product.name}</h4>
            <p className="text-base sm:text-lg font-bold text-green-600 mb-2">₦{product.price?.toLocaleString()}</p>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                <FaStar className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-700 font-medium">4.5</span>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">In Stock</span>
            </div>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 self-center shadow-sm"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Order</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default VendorStorePage