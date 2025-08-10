import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Filter } from 'lucide-react'
import SearchBar from './search/SearchBar'
import ProductGrid from './catalog/ProductGrid'
import BottomNav from './catalog/BottomNav'
import Button from './ui/Button'
import { vendorsAPI } from '../services/api'

const SearchPage = () => {
  const { vendorId } = useParams()
  const [products, setProducts] = useState([])
  const [vendor, setVendor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  })

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await vendorsAPI.getVendorCatalog(vendorId)
        setVendor(response.data.vendor)
        setProducts(response.data.products)
      } catch (error) {
        console.error('Failed to fetch catalog:', error)
      }
    }
    fetchCatalog()
  }, [vendorId])

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesPrice = (!filters.minPrice || parseFloat(product.price) >= parseFloat(filters.minPrice)) &&
                         (!filters.maxPrice || parseFloat(product.price) <= parseFloat(filters.maxPrice))
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' })
  }

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex-1">Search Products</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800 text-sm sm:text-base">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="₦0"
                  className="w-full px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="₦100000"
                  className="w-full px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-gray-600 text-sm sm:text-base">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <ProductGrid products={filteredProducts} vendor={vendor} showMessageButtons={true} />
      </div>

      <BottomNav vendor={vendor} />
    </div>
  )
}

export default SearchPage