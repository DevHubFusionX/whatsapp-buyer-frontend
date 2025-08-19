import { useState, useEffect } from 'react'
import { FaSearch, FaStar, FaShoppingBag, FaWhatsapp, FaStore, FaFilter, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          buyerAPI.getProducts(),
          buyerAPI.getVendors()
        ])
        
        setProducts(productsRes.data || [])
        setVendors(vendorsRes.data || [])
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsRes.data?.map(p => p.category).filter(Boolean) || [])]
        setCategories(uniqueCategories)
        
        // Load recent searches
        const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]')
        setRecentSearches(saved)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setProducts([])
        setVendors([])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory, products])

  const performSearch = () => {
    if (!searchQuery.trim() && !selectedCategory) {
      setFilteredProducts([])
      return
    }
    
    setSearchLoading(true)
    
    let filtered = products
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }
    
    setFilteredProducts(filtered)
    setSearchLoading(false)
    
    // Save to recent searches
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
    }
  }

  const saveRecentSearch = (query) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setFilteredProducts([])
  }

  const getVendorInfo = (vendorId) => {
    return vendors.find(v => v._id === vendorId)
  }

  const orderOnWhatsApp = (product, vendor) => {
    const message = `Hi ${vendor?.businessName || 'there'}! I want to order "${product.name}" for ₦${product.price?.toLocaleString()}.`
    const whatsappUrl = `https://wa.me/${vendor?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
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

  const hasActiveSearch = searchQuery.trim() || selectedCategory
  const showResults = hasActiveSearch && (filteredProducts.length > 0 || !searchLoading)

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Search Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, brands, or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <FaTimes className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {/* Filter Toggle */}
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <FaFilter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
                {selectedCategory && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">1</span>}
              </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      !selectedCategory ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedCategory === category ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {!hasActiveSearch ? (
            <div>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Searches</h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="flex items-center space-x-3 w-full p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <FaSearch className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              <div className="text-center py-12">
                <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Search for products</h3>
                <p className="text-gray-500">Find products, brands, or stores</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm">
                  {searchLoading ? 'Searching...' : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              
              {/* Results */}
              {filteredProducts.length === 0 && !searchLoading ? (
                <div className="text-center py-12">
                  <FaShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
                  <p className="text-gray-500">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => {
                    const vendor = getVendorInfo(product.vendorId)
                    return (
                      <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex p-4 space-x-4">
                          {/* Product Image */}
                          <Link to={`/product/${product._id}`} className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaShoppingBag className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${product._id}`}>
                              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                              <p className="text-xl font-bold text-green-600 mb-2">₦{product.price?.toLocaleString()}</p>
                            </Link>
                            
                            {/* Vendor Info */}
                            {vendor && (
                              <Link to={`/store/${vendor._id}`} className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <FaStore className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 truncate">{vendor.businessName}</span>
                              </Link>
                            )}

                            {/* CTA Button */}
                            <button
                              onClick={() => orderOnWhatsApp(product, vendor)}
                              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                            >
                              <FaWhatsapp className="w-4 h-4" />
                              <span>Order Now</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default SearchPage