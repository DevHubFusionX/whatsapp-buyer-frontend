import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle, Package, MapPin } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import { vendorsAPI } from '../services/api'

const VendorProfile = () => {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await vendorsAPI.getVendorCatalog(vendorId)
        setVendor(response.data.vendor)
        setProducts(response.data.products)
      } catch (error) {
        console.error('Failed to fetch vendor:', error)
      }
      setLoading(false)
    }
    fetchVendor()
  }, [vendorId])

  const handleContactVendor = () => {
    if (!vendor) return
    
    const message = `Hi! I found your business profile and I'm interested in your products.`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3">
          <Link
            to={`/catalog/${vendor.catalogId}`}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">Vendor Profile</h1>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 pb-20 sm:pb-24">
        <Card className="text-center p-6 sm:p-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            {vendor.logo ? (
              <img src={vendor.logo} alt="Logo" className="w-full h-full object-cover rounded-xl sm:rounded-2xl" />
            ) : (
              <Package className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{vendor.businessName}</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">by {vendor.name}</p>
          
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-4 sm:mb-6">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">{vendor.phoneNumber}</span>
          </div>

          <Button onClick={handleContactVendor} className="w-full" size="md">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Contact Vendor
          </Button>
        </Card>

        {vendor.about && (
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{vendor.about}</p>
          </Card>
        )}

        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Business Information</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Total Products</p>
                <p className="font-medium text-gray-800 text-sm sm:text-base">{products.length} items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-800 text-sm sm:text-base">Active</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="space-y-3">
            <Link
              to={`/catalog/${vendor.catalogId}`}
              className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg sm:rounded-xl hover:bg-green-100 transition-colors"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-medium text-green-700 text-sm sm:text-base">Browse Products</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VendorProfile