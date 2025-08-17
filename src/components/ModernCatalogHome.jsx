import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MessageCircle, Phone, Share2, Package, Search, Heart, Star, ShoppingCart, ArrowLeft, Filter, Grid, List, MapPin, Clock, Zap, Gift, Users } from 'lucide-react'
import { vendorsAPI, buyerAPI } from '../services/api'
import FloatingCart from './cart/FloatingCart'

const ModernCatalogHome = () => {
  const { vendorId } = useParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await vendorsAPI.getVendorCatalog(vendorId)
        if (response.data?.vendor) {
          setVendor(response.data.vendor)
          const productList = response.data.products || []
          setProducts(productList)
          setFilteredProducts(productList)
          setCategories([...new Set(productList.map(p => p.category))])
        }
      } catch (error) {
        console.error('Failed to load catalog:', error)
      }
      setLoading(false)
    }

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setCartItems(savedCart)
    setWishlist(savedWishlist)
    
    fetchCatalog()
  }, [vendorId])

  useEffect(() => {
    let filtered = products
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory])

  const handleAddToCart = (product) => {
    const cartItem = { ...product, vendor, quantity: 1 }
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = existingCart.findIndex(item => item._id === product._id)
    
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    setCartItems(existingCart)
  }

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item._id === product._id)
    let newWishlist = isInWishlist 
      ? wishlist.filter(item => item._id !== product._id)
      : [...wishlist, product]
    
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
  }

  const handleContactVendor = async () => {
    // Log interaction
    try {
      const buyerId = localStorage.getItem('buyerId')
      if (buyerId) {
        await buyerAPI.logInteraction({
          buyerId,
          vendorId: vendor._id,
          action: 'MessageVendor',
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }

    const message = `Hi! I'm interested in your products from your online catalog. Can you help me?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShare = () => {
    const catalogUrl = `${window.location.origin}/catalog/${vendor.catalogId}`
    const shareText = `🛍️ Check out ${vendor.businessName}'s amazing products! ${catalogUrl}`
    
    if (navigator.share) {
      navigator.share({ title: vendor.businessName, text: shareText, url: catalogUrl })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Store link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading store...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Store Not Found</h2>
          <p className="text-gray-600">This store may no longer be available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-20">
        <div className="p-4">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
              <div className="relative">
                <Heart className="w-6 h-6 text-red-500" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Store Hero Section */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-6 text-white mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                {vendor.logo ? (
                  <img src={vendor.logo} alt="Logo" className="w-16 h-16 object-cover rounded-xl" />
                ) : (
                  <Package className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{vendor.businessName}</h1>
                <p className="text-white/80 text-sm mb-2">by {vendor.name}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-sm">{vendor.rating || 4.8}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{products.length} products</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleContactVendor}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-2xl font-medium flex items-center justify-center space-x-2 hover:bg-white/30 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat Now</span>
              </button>
              <button
                onClick={handleShare}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-2xl font-medium flex items-center justify-center space-x-2 hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Store</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results and View Toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} products found
              </p>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : 'This store is currently empty'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="bg-green-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-green-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div 
                  className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
                  onClick={() => window.location.href = `/product/${product._id}`}
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(product)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.some(item => item._id === product._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    className="absolute bottom-3 right-3 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors transform hover:scale-110 z-10"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>

                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => window.location.href = `/product/${product._id}`}
                >
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{product.views || 0} views</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">₦{product.price.toLocaleString()}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="w-2 h-2 bg-green-400 rounded-full mb-1"></div>
                      <span className="text-xs text-gray-500">In Stock</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex space-x-4">
                  <div 
                    className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                    onClick={() => window.location.href = `/product/${product._id}`}
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 
                        className="font-bold text-gray-900 text-xl cursor-pointer hover:text-green-600 transition-colors"
                        onClick={() => window.location.href = `/product/${product._id}`}
                      >
                        {product.name}
                      </h3>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Heart className={`w-6 h-6 ${wishlist.some(item => item._id === product._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-green-600">₦{product.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{product.views || 0} views</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors transform hover:scale-105"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <FloatingCart
        items={cartItems}
        vendor={vendor}
        onUpdateQuantity={(productId, quantity) => {
          const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
          if (quantity === 0) {
            const updatedCart = existingCart.filter(item => item._id !== productId)
            localStorage.setItem('cart', JSON.stringify(updatedCart))
            setCartItems(updatedCart)
          } else {
            const updatedCart = existingCart.map(item => 
              item._id === productId ? { ...item, quantity } : item
            )
            localStorage.setItem('cart', JSON.stringify(updatedCart))
            setCartItems(updatedCart)
          }
        }}
        onRemoveItem={(productId) => {
          const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
          const updatedCart = existingCart.filter(item => item._id !== productId)
          localStorage.setItem('cart', JSON.stringify(updatedCart))
          setCartItems(updatedCart)
        }}
      />

      {/* Floating WhatsApp Button */}
      {cartItems.length === 0 && (
        <button
          onClick={handleContactVendor}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}

      {/* Bottom Padding */}
      <div className="h-24"></div>
    </div>
  )
}

export default ModernCatalogHome