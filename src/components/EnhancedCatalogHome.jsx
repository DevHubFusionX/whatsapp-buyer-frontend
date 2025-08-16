import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MessageCircle, Phone, Share2, Package, Search, Grid, List, Filter, Star, Heart, ArrowLeft, SlidersHorizontal, TrendingUp } from 'lucide-react'
import { vendorsAPI } from '../services/api'
import FloatingCart from './cart/FloatingCart'

const EnhancedCatalogHome = () => {
  const { vendorId } = useParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [vendor, setVendor] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await vendorsAPI.getVendorCatalog(vendorId)
        if (response.data && response.data.vendor) {
          setVendor(response.data.vendor)
          const productList = response.data.products || []
          setProducts(productList)
          setFilteredProducts(productList)
          
          // Extract unique categories
          const uniqueCategories = [...new Set(productList.map(p => p.category))]
          setCategories(uniqueCategories)
          
          setError('')
        } else {
          setError('Vendor not found')
        }
      } catch (error) {
        setError('Failed to load catalog')
        setVendor(null)
        setProducts([])
      }
      setLoading(false)
    }
    
    // Load saved data from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setCartItems(savedCart)
    setWishlist(savedWishlist)
    
    fetchCatalog()
  }, [vendorId])

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, priceRange, sortBy])

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

  const handleUpdateQuantity = (productId, quantity) => {
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
  }

  const handleRemoveItem = (productId) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const updatedCart = existingCart.filter(item => item._id !== productId)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartItems(updatedCart)
  }

  const handleContactVendor = () => {
    const message = `Hi! I'm browsing your catalog and interested in your products. Please tell me more!`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item._id === product._id)
    let newWishlist
    
    if (isInWishlist) {
      newWishlist = wishlist.filter(item => item._id !== product._id)
    } else {
      newWishlist = [...wishlist, product]
    }
    
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading catalog...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Store Not Found</h2>
          <p className="text-gray-600">This catalog link may be invalid.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm">
        <div className="p-4">
          {/* Navigation */}
          <div className="flex items-center space-x-3 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Store Catalog</h1>
          </div>

          {/* Vendor Info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              {vendor.logo ? (
                <img src={vendor.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <Package className="w-8 h-8 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{vendor.businessName}</h2>
              <p className="text-gray-600 text-sm">by {vendor.name}</p>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{vendor.rating || 4.8}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">{vendor.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleContactVendor}
              className="bg-green-500 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </button>
            <button
              onClick={() => {
                const catalogUrl = `https://whatsapp-buyer-frontend.vercel.app/catalog/${vendor.catalogId}`
                navigator.share ? navigator.share({ url: catalogUrl }) : navigator.clipboard.writeText(catalogUrl)
              }}
              className="border border-green-500 text-green-600 px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-green-50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Store</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Results and View Toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} of {products.length} products
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Products Display */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : 'This store has no products yet'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                    </div>
                    <span className="text-xs text-gray-500">{product.views || 0} views</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 font-bold text-xl">₦{product.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                          </div>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{product.views || 0} views</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
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
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Floating WhatsApp Button */}
      {cartItems.length === 0 && (
        <button
          onClick={handleContactVendor}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

export default EnhancedCatalogHome