import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MessageCircle, Phone, Share2, Package, Search, Grid, List } from 'lucide-react'
import { vendorsAPI } from '../services/api'
import { trackProductView } from '../services/tracking'
import ProductCard from './catalog/ProductCard'
import FloatingCart from './cart/FloatingCart'

const CatalogHome = () => {
  const { vendorId } = useParams()
  const [products, setProducts] = useState([])
  const [vendor, setVendor] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await vendorsAPI.getVendorCatalog(vendorId)
        if (response.data && response.data.vendor) {
          setVendor(response.data.vendor)
          setProducts(response.data.products || [])
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
    
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(savedCart)
    
    fetchCatalog()
  }, [vendorId])

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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="p-4">
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
              <h1 className="text-xl font-bold text-gray-800">{vendor.businessName}</h1>
              <p className="text-gray-600 text-sm">by {vendor.name}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Phone className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">{vendor.phoneNumber}</span>
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

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{filteredProducts.length} products available</p>
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

      {/* Products */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                vendor={vendor}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                vendor={vendor}
                onAddToCart={handleAddToCart}
              />
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

export default CatalogHome