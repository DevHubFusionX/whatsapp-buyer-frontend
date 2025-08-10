import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, List, Package } from 'lucide-react'
import ProductGrid from './catalog/ProductGrid'
import ProductList from './catalog/ProductList'
import BottomNav from './catalog/BottomNav'
import VendorHeader from './catalog/VendorHeader'
import SearchBar from './search/SearchBar'
import PhoneCapture from './PhoneCapture'
import { vendorsAPI } from '../services/api'

const CatalogHome = () => {
  const { vendorId } = useParams() // This is the catalogId from URL
  const [products, setProducts] = useState([])
  const [vendor, setVendor] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPhoneCapture, setShowPhoneCapture] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        console.log('Fetching catalog for catalogId:', vendorId)
        console.log('API URL:', `https://whatsapp-vendor.onrender.com/api/vendors/${vendorId}`)
        
        const response = await vendorsAPI.getVendorCatalog(vendorId)
        console.log('API Response:', response.data)
        
        if (response.data && response.data.vendor) {
          setVendor(response.data.vendor)
          setProducts(response.data.products || [])
          setError('')
          console.log('Loaded vendor:', response.data.vendor.businessName)
          console.log('Loaded products:', response.data.products.length)
        } else {
          console.log('No vendor data received')
          setError('Vendor not found')
          setVendor(null)
          setProducts([])
        }
      } catch (error) {
        console.error('Failed to fetch catalog:', error)
        console.error('Error status:', error.response?.status)
        console.error('Error details:', error.response?.data)
        setError(error.response?.data?.message || `Failed to load catalog: ${error.message}`)
        setVendor(null)
        setProducts([])
      }
      setLoading(false)
      
      // Show phone capture after 10 seconds if not already captured
      if (!localStorage.getItem('customerPhone')) {
        setTimeout(() => setShowPhoneCapture(true), 10000)
      }
    }
    fetchCatalog()
  }, [vendorId])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!vendor && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Vendor Not Found</h2>
          <p className="text-gray-600 mb-2">{error || 'This catalog link may be invalid.'}</p>
          <p className="text-sm text-gray-500">Vendor ID: {vendorId}</p>
          <p className="text-sm text-gray-500">Check browser console for details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-3 sm:p-4">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 truncate">{vendor?.businessName || 'Loading...'}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Catalog ID: {vendorId}</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-2">Products: {products.length} | Vendor: {vendor ? 'Found' : 'Not Found'}</p>
          {error && <p className="text-xs sm:text-sm text-red-500 mb-2">Error: {error}</p>}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        
        <div className="px-3 sm:px-4 pb-2 sm:pb-3 flex justify-end">
          <div className="flex bg-gray-100 rounded-lg p-0.5 sm:p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
        <VendorHeader 
          vendor={vendor} 
          productCount={products.length}
          onMessage={() => {
            const message = `Hi! I'm browsing your catalog and interested in your products.`
            const whatsappUrl = `https://wa.me/${vendor?.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, '_blank')
          }}
        />
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-500">No products found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <ProductGrid products={filteredProducts} vendor={vendor} showMessageButtons={true} />
        ) : (
          <ProductList products={filteredProducts} vendor={vendor} showMessageButtons={true} />
        )}
      </div>

      <BottomNav vendor={vendor} />
      
      {showPhoneCapture && (
        <PhoneCapture
          onSubmit={() => setShowPhoneCapture(false)}
          onSkip={() => setShowPhoneCapture(false)}
        />
      )}
    </div>
  )
}

export default CatalogHome