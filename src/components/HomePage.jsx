import { useState, useEffect } from 'react'
import { Search, MapPin, Star, TrendingUp, Heart, ShoppingBag, Filter, Bell, User, Clock, Zap, Gift, Home, ArrowRight, Sparkles, LogIn, UserPlus } from 'lucide-react'
import { 
  MdFastfood, 
  MdCheckroom, 
  MdPhoneIphone, 
  MdFace, 
  MdHome, 
  MdSportsBasketball, 
  MdMenuBook, 
  MdMoreHoriz 
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import api from '../services/api'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredVendors, setFeaturedVendors] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [notifications, setNotifications] = useState([])
  const [deals, setDeals] = useState([])
  const [userName, setUserName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [buyer, setBuyer] = useState(null)

  const categories = [
    { name: 'Food', icon: MdFastfood, color: 'bg-orange-100 text-orange-600' },
    { name: 'Fashion', icon: MdCheckroom, color: 'bg-purple-100 text-purple-600' },
    { name: 'Electronics', icon: MdPhoneIphone, color: 'bg-blue-100 text-blue-600' },
    { name: 'More', icon: MdMoreHoriz, color: 'bg-gray-100 text-gray-600' }
  ]

  const locations = ['All Locations', 'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan']

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/buyer/auth-check')
        if (response.data.authenticated) {
          setIsAuthenticated(true)
          setBuyer(response.data.buyer)
          setUserName(response.data.buyer.name)
        } else {
          setIsAuthenticated(false)
          setUserName('Guest')
        }
      } catch (error) {
        setIsAuthenticated(false)
        setUserName('Guest')
      }
    }

    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          buyerAPI.getFeaturedProducts(),
          buyerAPI.getVendors()
        ])
        
        setFeaturedProducts(productsRes.data.slice(0, 6))
        setFeaturedVendors(vendorsRes.data.slice(0, 4))
        
        // Load user data from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        const savedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        
        setWishlist(savedWishlist)
        setRecentlyViewed(savedRecentlyViewed.slice(0, 4))
        
        // Mock deals and notifications
        setDeals([
          { id: 1, title: '20% off Electronics', vendor: 'TechHub', expires: '2 days left' },
          { id: 2, title: 'Free Delivery on Orders ₦5000+', vendor: 'FashionWorld', expires: '5 days left' }
        ])
        
        setNotifications([
          { id: 1, message: 'Your order from TechStore is ready for pickup', time: '2h ago' },
          { id: 2, message: 'New products added to your favorite store', time: '1d ago' }
        ])
        
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    
    checkAuth()
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">VendorTool</h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">Hello, {userName}! 👋</p>
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <button className="relative p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all duration-200">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  <Link to="/wishlist" className="relative p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200">
                    <Heart className="w-5 h-5" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link to="/profile" className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200">
                    <User className="w-5 h-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-2xl transition-all duration-200">
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                  <Link to="/signup" className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-2xl transition-all duration-200">
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, vendors, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-3xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Location with Modern Design */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-2xl">
              <MapPin className="w-4 h-4 text-green-600" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-green-700 focus:outline-none cursor-pointer"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">


        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Continue Shopping</h2>
              <Link to="/recently-viewed" className="text-green-600 font-medium text-sm">
                View All
              </Link>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {recentlyViewed.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-32 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-gray-800 text-xs mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-green-600 font-bold text-sm">₦{product.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simplified Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.name}
                  to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${category.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {category.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>



        {/* Simplified Vendors */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Stores</h2>
          <div className="space-y-3">
            {featuredVendors.slice(0, 3).map((vendor) => (
              <div key={vendor._id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      {vendor.logo ? (
                        <img src={vendor.logo} alt={vendor.businessName} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vendor.businessName}</h3>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{vendor.rating || 4.8}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/catalog/${vendor.catalogId}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Visit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>




      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center p-2 text-green-600">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link to="/search" className="flex flex-col items-center p-2 text-gray-400">
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs">Search</span>
          </Link>
          
          <Link to="/cart" className="flex flex-col items-center p-2 text-gray-400 relative">
            <ShoppingBag className="w-6 h-6 mb-1" />
            <span className="text-xs">Cart</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
          
          <Link to="/orders" className="flex flex-col items-center p-2 text-gray-400">
            <Clock className="w-6 h-6 mb-1" />
            <span className="text-xs">Orders</span>
          </Link>
          
          {isAuthenticated ? (
            <Link to="/profile" className="flex flex-col items-center p-2 text-gray-400">
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs">Profile</span>
            </Link>
          ) : (
            <Link to="/login" className="flex flex-col items-center p-2 text-gray-400">
              <LogIn className="w-6 h-6 mb-1" />
              <span className="text-xs">Login</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Add bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}

export default HomePage