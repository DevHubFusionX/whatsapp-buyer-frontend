import { useState, useEffect } from 'react'
import { FaSearch, FaStar, FaStore, FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const VendorStoresPage = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await buyerAPI.getVendors()
        setVendors(response.data)
      } catch (error) {
        console.error('Failed to fetch vendors:', error)
      }
      setLoading(false)
    }
    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const contactVendor = (vendor) => {
    const message = `Hi ${vendor.businessName}! I found your store and would like to know more about your products.`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
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

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Stores</h1>
          <p className="text-gray-600">Discover amazing vendors and their products</p>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Vendors Grid */}
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <div key={vendor._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {vendor.logo ? (
                    <img src={vendor.logo} alt={vendor.businessName} className="w-14 h-14 object-cover rounded-lg" />
                  ) : (
                    <FaStore className="w-8 h-8 text-green-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{vendor.businessName}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{vendor.rating || 4.8}</span>
                    </div>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{vendor.productCount || 25} products</span>
                  </div>
                  
                  {vendor.about && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vendor.about}</p>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/store/${vendor._id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Store
                    </Link>
                    <button
                      onClick={() => contactVendor(vendor)}
                      className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <FaStore className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default VendorStoresPage