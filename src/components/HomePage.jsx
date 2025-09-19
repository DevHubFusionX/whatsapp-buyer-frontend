import { useState, useEffect } from 'react'
import { FaSearch, FaStar, FaShoppingBag, FaHeart, FaFire, FaTag, FaQuestionCircle, FaWhatsapp, FaShieldAlt, FaTruck } from 'react-icons/fa'
import { MdFastfood, MdCheckroom, MdPhoneIphone, MdHome, MdVerified, MdTrendingUp, MdInfo } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'
import GuestPrompt from './GuestPrompt'
import { HomePageSkeleton } from './ui/LoadingSkeleton'
import ShoppingGuide from './ui/ShoppingGuide'
import ProductTips from './ui/ProductTips'


const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredVendors, setFeaturedVendors] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showTips, setShowTips] = useState(true)

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenShoppingGuide')
    if (!hasSeenGuide) {
      setShowGuide(true)
    }
  }, [])

  const handleGuideComplete = () => {
    setShowGuide(false)
    localStorage.setItem('hasSeenShoppingGuide', 'true')
  }

  useEffect(() => {
    const token = localStorage.getItem('buyerToken')
    setIsLoggedIn(!!token)
  }, [])

  const categoryList = [
    { name: 'Food', icon: MdFastfood, color: 'bg-orange-100 text-orange-600' },
    { name: 'Fashion', icon: MdCheckroom, color: 'bg-purple-100 text-purple-600' },
    { name: 'Electronics', icon: MdPhoneIphone, color: 'bg-blue-100 text-blue-600' },
    { name: 'Home', icon: MdHome, color: 'bg-green-100 text-green-600' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          buyerAPI.getFeaturedProducts(),
          buyerAPI.getVendors()
        ])
        setFeaturedProducts(productsRes.data.slice(0, 6))
        setFeaturedVendors(vendorsRes.data.slice(0, 4))
        setCategories(categoryList)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
      setLoading(false)
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <Layout>
        <HomePageSkeleton />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-green-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome to Vendly! 🛍️</h1>
              <p className="text-sm sm:text-base text-gray-600">Discover amazing products from local vendors and shop directly via WhatsApp</p>
            </div>
            <div className="flex justify-center sm:block">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <FaWhatsapp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{featuredProducts.length * 20}+</div>
              <div className="text-xs text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{featuredVendors.length * 10}+</div>
              <div className="text-xs text-gray-600">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* Guest Prompt */}
        {!isLoggedIn && <GuestPrompt />}
        
        {/* How It Works */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-lg font-bold text-gray-900">How Vendly Works</h2>
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium w-full sm:w-auto"
            >
              <FaQuestionCircle className="w-4 h-4" />
              <span>Full Guide</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaSearch className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">1. Browse & Search</h3>
              <p className="text-xs sm:text-sm text-gray-600">Find products from local vendors instantly</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">2. Chat on WhatsApp</h3>
              <p className="text-xs sm:text-sm text-gray-600">Contact vendors directly for details</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <FaShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">3. Complete Purchase</h3>
              <p className="text-xs sm:text-sm text-gray-600">Buy directly from the vendor</p>
            </div>
          </div>
        </div>
        
        {/* Shopping Tips */}
        <ProductTips isVisible={showTips} onClose={() => setShowTips(false)} />
        


        {/* Search Bar */}
        <Link to="/search" className="block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <div className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-500 shadow-sm hover:border-green-300 transition-colors text-center font-medium">
              🔍 Search for products, brands, or stores...
            </div>
          </div>
        </Link>

        {/* Categories */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-lg font-bold text-gray-900">Shop by Category</h2>
            <div className="flex items-center space-x-1 text-green-600">
              <MdTrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Popular</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.name}
                  to={`/search?category=${category.name.toLowerCase()}`}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 ${category.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center group-hover:text-green-600 transition-colors">
                    {category.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Trending Products</h2>
              <p className="text-sm text-gray-600">Popular items from verified vendors</p>
            </div>
            <div className="flex items-center space-x-1 text-red-500">
              <FaFire className="w-4 h-4" />
              <span className="text-sm font-medium">Hot Deals</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {featuredProducts.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaShoppingBag className="w-12 h-12 text-gray-400" />
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-red-50">
                    <FaHeart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-green-600 font-bold text-sm sm:text-lg">₦{product.price?.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-600">4.5</span>
                    </div>
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 space-y-1 sm:space-y-0">
                      <span className="text-xs text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center space-x-1 w-fit">
                        <FaTag className="w-2 h-2" />
                        <span>Sale</span>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>


        
        {/* Why Choose Vendly */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 border border-purple-200/50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Why Shop with Vendly?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-start space-x-3 p-3 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">Verified Vendors</h3>
                <p className="text-xs text-gray-600 mt-1">All vendors are verified for quality and reliability</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">Direct Communication</h3>
                <p className="text-xs text-gray-600 mt-1">Chat directly with vendors on WhatsApp</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaTruck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">Local Delivery</h3>
                <p className="text-xs text-gray-600 mt-1">Fast delivery from vendors near you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Vendors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Featured Professional Stores</h2>
              <p className="text-sm text-gray-600">Trusted vendors with excellent ratings</p>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <MdVerified className="w-4 h-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          </div>
          <div className="space-y-3">
            {featuredVendors.map((vendor) => (
              <div key={vendor._id} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center relative flex-shrink-0">
                      {vendor.logo ? (
                        <img src={vendor.logo} alt={vendor.businessName} className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg" />
                      ) : (
                        <FaShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      )}
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <MdVerified className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{vendor.businessName || vendor.name}</h3>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <div className="flex items-center space-x-1">
                          <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                          <span className="text-xs sm:text-sm text-gray-600">{vendor.rating || 4.8}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400">•</span>
                        <span className="text-xs sm:text-sm text-gray-600">{vendor.products?.length || vendor.productCount || 25} products</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mt-1 space-y-1 sm:space-y-0">
                        <p className="text-xs text-green-600 flex items-center space-x-1">
                          <MdVerified className="w-3 h-3" />
                          <span>Professional storefront</span>
                        </p>
                        <p className="text-xs text-blue-600 flex items-center space-x-1">
                          <FaWhatsapp className="w-3 h-3" />
                          <span>WhatsApp ready</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/store/${vendor._id || vendor.catalogId}`}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-sm text-center"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Getting Started */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MdInfo className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">New to Vendly?</h2>
              <p className="text-sm text-gray-600">Get started in just a few simple steps</p>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
              <span className="text-xs sm:text-sm text-gray-700 flex-1">Browse products without signing up</span>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
              <span className="text-xs sm:text-sm text-gray-700 flex-1">Click "Order on WhatsApp" to contact vendors</span>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
              <span className="text-xs sm:text-sm text-gray-700 flex-1">Complete your purchase directly with the vendor</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowGuide(true)}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all text-sm sm:text-base"
          >
            Learn More - Full Shopping Guide
          </button>
        </div>
        
        {/* Shopping Guide Modal */}
        <ShoppingGuide isOpen={showGuide} onClose={handleGuideComplete} />
      </div>
    </Layout>
  )
}

export default HomePage