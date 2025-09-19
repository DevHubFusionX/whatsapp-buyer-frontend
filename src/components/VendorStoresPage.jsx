import { useState, useEffect } from 'react'
import { FaSearch, FaStar, FaStore, FaWhatsapp, FaShieldAlt, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa'
import { MdVerified, MdTrendingUp, MdInfo, MdFilterList } from 'react-icons/md'
import { Store, Users, Award, CheckCircle, MessageCircle, Phone, MapPin, Clock, Star, Filter, Info, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const VendorStoresPage = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [filterBy, setFilterBy] = useState('all')

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await buyerAPI.getVendors()
        setVendors(response.data)
      } catch (error) {
        console.error('Failed to fetch vendors:', error)
      }
      setLoading(false)
    }
    fetchVendors()
  }, [])

  const filteredVendors = vendors
    .filter(vendor =>
      vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8)
      if (sortBy === 'products') return (b.productCount || 25) - (a.productCount || 25)
      if (sortBy === 'name') return (a.businessName || a.name || '').localeCompare(b.businessName || b.name || '')
      return 0
    })

  const contactVendor = (vendor) => {
    const message = `Hi ${vendor.businessName}! I found your store on Vendly and would like to know more about your products. What do you have available?`
    const whatsappUrl = `https://wa.me/${vendor.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Professional Stores 🏪</h1>
              <p className="text-sm sm:text-base text-gray-600">Discover verified vendors and shop directly via WhatsApp</p>
            </div>
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How to Shop</span>
            </button>
          </div>
          
          {/* Store Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 bg-white/60 rounded-xl">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{vendors.length}</div>
              <div className="text-xs text-gray-600">Verified Stores</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-xl">
              <div className="text-lg sm:text-2xl font-bold text-green-600">1000+</div>
              <div className="text-xs text-gray-600">Products</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-xl">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">4.8★</div>
              <div className="text-xs text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
        
        {/* Shopping Guide */}
        {showGuide && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">How to Shop from Stores</h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Store className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Browse Stores</h4>
                <p className="text-sm text-gray-600">Explore verified professional vendors</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Chat on WhatsApp</h4>
                <p className="text-sm text-gray-600">Contact vendors directly for products</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Complete Purchase</h4>
                <p className="text-sm text-gray-600">Buy directly from the vendor</p>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="🔍 Search stores by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors text-sm sm:text-base"
            />
          </div>
          
          {/* Sort & Filter Options */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="products">Sort by Products</option>
              <option value="name">Sort by Name</option>
            </select>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MdTrendingUp className="w-4 h-4" />
              <span>{filteredVendors.length} stores found</span>
            </div>
          </div>
        </div>

        {/* Enhanced Vendors Grid */}
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <div key={vendor._id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 relative">
                  {vendor.logo ? (
                    <img src={vendor.logo} alt={vendor.businessName} className="w-14 h-14 sm:w-18 sm:h-18 object-cover rounded-lg" />
                  ) : (
                    <FaStore className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  )}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <MdVerified className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">{vendor.businessName}</h3>
                      <div className="flex items-center justify-center sm:justify-start space-x-4 mb-3">
                        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-yellow-700">{vendor.rating || 4.8}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                          <Store className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-700">{vendor.productCount || 25} products</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-green-700">Active Now</span>
                    </div>
                  </div>
                  
                  {/* Store Features */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Professional</span>
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp Ready</span>
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Fast Response</span>
                    </span>
                  </div>
                  
                  {vendor.about && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{vendor.about}</p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Link
                      to={`/store/${vendor._id}`}
                      className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl text-center font-medium hover:from-gray-200 hover:to-gray-300 transition-all flex items-center justify-center space-x-2"
                    >
                      <Store className="w-4 h-4" />
                      <span>Browse Store</span>
                    </Link>
                    <button
                      onClick={() => contactVendor(vendor)}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaStore className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or browse all stores</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-green-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Show All Stores
            </button>
          </div>
        )}
        
        {/* Shopping Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-200/50">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            💡 Shopping Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Ask Questions</h4>
                <p className="text-xs text-gray-600 mt-1">Don't hesitate to ask about product availability, prices, and delivery options</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Direct Communication</h4>
                <p className="text-xs text-gray-600 mt-1">Chat directly with vendors on WhatsApp for personalized service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default VendorStoresPage