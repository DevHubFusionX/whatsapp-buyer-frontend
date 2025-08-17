import { useState, useEffect } from 'react'
import { FaSearch, FaStar, FaShoppingBag, FaHeart, FaFilter } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await buyerAPI.getProducts()
        setProducts(response.data)
        setFilteredProducts(response.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Results */}
        <div>
          <p className="text-gray-600 text-sm mb-4">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaShoppingBag className="w-12 h-12 text-gray-400" />
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm">
                    <FaHeart className="w-4 h-4 text-gray-400" />
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SearchPage