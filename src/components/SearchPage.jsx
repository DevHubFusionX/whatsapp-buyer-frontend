import { useState, useEffect, useCallback } from 'react'
import { FaSearch, FaStar, FaShoppingBag, FaWhatsapp, FaStore } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const SearchPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Debounced search function
  const debounceSearch = useCallback(
    (() => {
      let timeoutId
      return (query) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          performSearch(query)
        }, 300)
      }
    })(),
    []
  )

  const performSearch = async (query) => {
    if (!query.trim()) {
      setFilteredProducts([])
      return
    }
    
    setLoading(true)
    try {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredProducts(filtered)
    } catch (error) {
      console.error('Search failed:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          buyerAPI.getProducts(),
          buyerAPI.getVendors()
        ])
        setProducts(productsRes.data)
        setVendors(vendorsRes.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    debounceSearch(searchQuery)
  }, [searchQuery, debounceSearch])

  const getVendorInfo = (vendorId) => {
    return vendors.find(v => v._id === vendorId)
  }

  const orderOnWhatsApp = (product, vendor) => {
    const message = `Hi ${vendor?.businessName || 'there'}! I want to order "${product.name}" for ₦${product.price?.toLocaleString()}.`
    const whatsappUrl = `https://wa.me/${vendor?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, brands, or stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="p-4">
          {searchQuery.trim() && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm">
                {loading ? 'Searching...' : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
          )}
          
          {!searchQuery.trim() ? (
            <div className="text-center py-12">
              <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Search for products</h3>
              <p className="text-gray-500">Find products, brands, or stores</p>
            </div>
          ) : filteredProducts.length === 0 && !loading ? (
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
      </div>
    </Layout>
  )
}

export default SearchPage