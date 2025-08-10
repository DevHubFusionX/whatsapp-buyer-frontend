import { MessageCircle, Package, Phone, Share2 } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

const VendorHeader = ({ vendor, onMessage, productCount }) => {
  const handleShare = () => {
    const catalogUrl = `https://whatsapp-buyer-frontend.vercel.app/catalog/${vendor.catalogId}`
    const message = `🛍️ Check out ${vendor.businessName}'s catalog with ${productCount} products!\n\n${catalogUrl}`
    
    if (navigator.share) {
      navigator.share({
        title: `${vendor.businessName} - Product Catalog`,
        text: message,
        url: catalogUrl
      })
    } else {
      navigator.clipboard.writeText(catalogUrl)
      alert('Catalog link copied to clipboard!')
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
          {vendor?.logo ? (
            <img src={vendor.logo} alt="Logo" className="w-full h-full object-cover rounded-xl sm:rounded-2xl" />
          ) : (
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{vendor?.businessName}</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-1 truncate">by {vendor?.name}</p>
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-500 truncate">{vendor?.phoneNumber}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <Button onClick={() => onMessage()} size="md" className="w-full">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Message Vendor</span>
          <span className="xs:hidden">Message</span>
        </Button>
        
        <Button onClick={handleShare} variant="outline" size="md" className="w-full">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Share Catalog</span>
          <span className="xs:hidden">Share</span>
        </Button>
      </div>
    </Card>
  )
}

export default VendorHeader