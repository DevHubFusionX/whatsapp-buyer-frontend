import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaSearch, FaStar, FaShoppingBag, FaHeart, FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const VendorStorePage = () => {
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const [vendorsRes, productsRes] = await Promise.all([
          buyerAPI.getVendors(),
          buyerAPI.getProducts({ vendor: vendorId })
        ])
        
        const vendorInfo = vendorsRes.data.find(v => v._id === vendorId)
        setVendor(vendorInfo)
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
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

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
      <div className="bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Store</h1>
          <div></div>
        </div>

        {/* Vendor Info */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              {vendor.logo ? (
                <img src={vendor.logo} alt={vendor.businessName} className="w-14 h-14 object-cover rounded-lg" />
              ) : (
                <FaShoppingBag className="w-8 h-8 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{vendor.businessName}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <FaStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600">{vendor.rating || 4.8}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{filteredProducts.length} products</span>
              </div>
              {vendor.description && (
                <p className="text-sm text-gray-600 mt-2">{vendor.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search in ${vendor.businessName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Products</h3>
            <span className="text-sm text-gray-600">{filteredProducts.length} items</span>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <FaShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
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
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-green-600 font-bold text-lg">₦{product.price?.toLocaleString()}</p>
                      <div className="flex items-center space-x-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-gray-600">4.5</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default VendorStorePage