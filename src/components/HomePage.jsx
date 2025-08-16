import { useState, useEffect } from 'react'
import { Search, MapPin, Star, TrendingUp, Heart, ShoppingBag, Filter, Bell, User, Clock, Zap, Gift, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'

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

  const categories = [
    { name: 'Food & Drinks', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
    { name: 'Fashion', icon: '👕', color: 'bg-purple-100 text-purple-600' },
    { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-600' },
    { name: 'Beauty', icon: '💄', color: 'bg-pink-100 text-pink-600' },
    { name: 'Home & Garden', icon: '🏠', color: 'bg-green-100 text-green-600' },
    { name: 'Sports', icon: '⚽', color: 'bg-red-100 text-red-600' },
    { name: 'Books', icon: '📚', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'More', icon: '➕', color: 'bg-gray-100 text-gray-600' }
  ]

  const locations = ['All Locations', 'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          buyerAPI.getFeaturedProducts(),
          buyerAPI.getVendors()
        ])
        
        setFeaturedProducts(productsRes.data.slice(0, 6))
        setFeaturedVendors(vendorsRes.data.slice(0, 4))
        
        // Load user data from localStorage
        const savedUser = localStorage.getItem('buyerName') || 'Guest'
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        const savedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        
        setUserName(savedUser)
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
    
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VendorTool</h1>
              <p className="text-sm text-gray-600">Hello, {userName}! 👋</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products or vendors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Location Filter */}
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 py-2 px-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Deals Banner */}
        {deals.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5" />
              <h2 className="font-bold">Flash Deals</h2>
            </div>
            <div className="space-y-2">
              {deals.slice(0, 2).map(deal => (
                <div key={deal.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-sm opacity-90">{deal.vendor}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{deal.expires}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${category.color}`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Trending Products</h2>
            <Link to="/products" className="text-green-600 font-medium text-sm">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-green-600 font-bold text-lg">₦{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="text-gray-400 text-sm line-through">₦{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                    <span className="text-sm text-gray-400">({product.reviews || 12})</span>
                  </div>
                  <Link to={`/product/${product._id}`} className="block w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium text-center hover:bg-green-600 transition-colors">
                    Quick Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Vendors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Vendors</h2>
            <Link to="/vendors" className="text-green-600 font-medium text-sm">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredVendors.map((vendor) => (
              <div key={vendor._id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {vendor.logo ? (
                      <img src={vendor.logo} alt={vendor.businessName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-xl">🏪</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{vendor.businessName}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{vendor.rating || 4.8}</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{vendor.productCount || 25} products</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Fast Delivery</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Verified</span>
                  </div>
                  <Link
                    to={`/catalog/${vendor.catalogId}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/orders" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Orders</h3>
                <p className="text-sm text-gray-600">Track your purchases</p>
              </div>
            </div>
          </Link>
          
          <Link to="/wishlist" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Wishlist</h3>
                <p className="text-sm text-gray-600">{wishlist.length} saved items</p>
              </div>
            </div>
          </Link>
        </div>

        {/* App Features */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Gift className="w-6 h-6" />
            <h3 className="text-xl font-bold">Why Choose VendorTool?</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-sm opacity-90">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm opacity-90">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support</div>
            </div>
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
          
          <Link to="/profile" className="flex flex-col items-center p-2 text-gray-400">
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
      
      {/* Add bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}

export default HomePage