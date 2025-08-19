import { useState, useEffect } from 'react'
import { FaSearch, FaStar, FaShoppingBag, FaHeart, FaFire, FaTag } from 'react-icons/fa'
import { MdFastfood, MdCheckroom, MdPhoneIphone, MdHome } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'
import GuestPrompt from './GuestPrompt'
import { HomePageSkeleton } from './ui/LoadingSkeleton'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredVendors, setFeaturedVendors] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
        {/* Guest Prompt */}
        {!isLoggedIn && <GuestPrompt />}
        
        {/* Search Bar */}
        <Link to="/search" className="block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <div className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-500 shadow-sm">
              Search for products, brands, or stores...
            </div>
          </div>
        </Link>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.name}
                  className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${category.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {category.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Trending Products</h2>
            <div className="flex items-center space-x-1 text-red-500">
              <FaFire className="w-4 h-4" />
              <span className="text-sm font-medium">Hot Deals</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-green-600 font-bold text-lg">₦{product.price?.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-600">4.5</span>
                    </div>
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center space-x-1">
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

        {/* Featured Vendors */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Stores</h2>
          <div className="space-y-3">
            {featuredVendors.map((vendor) => (
              <div key={vendor._id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      {vendor.logo ? (
                        <img src={vendor.logo} alt={vendor.businessName} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <FaShoppingBag className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vendor.businessName}</h3>
                      <div className="flex items-center space-x-2">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">{vendor.rating || 4.8}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{vendor.productCount || 25} products</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/store/${vendor._id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage