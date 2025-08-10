import { MessageCircle, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { trackCustomerInterest } from '../../services/tracking'

const ProductCard = ({ product, vendor, showMessageButton = false }) => {
  const handleMessageVendor = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!vendor || !product) return
    
    // Track customer interest for vendor follow-up
    await trackCustomerInterest(product._id, vendor.id)
    
    const message = `Hello, I am interested in ${product.name} for ₦${product.price.toLocaleString()}.`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Link
      to={`/product/${product._id}?vendor=${product.vendor}`}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 block w-full"
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
        )}
        
        {showMessageButton && (
          <button
            onClick={handleMessageVendor}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
      
      <div className="p-2 sm:p-3">
        <h3 className="font-medium text-gray-800 text-xs sm:text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h3>
        <p className="text-sm sm:text-lg font-bold text-green-600 mb-2">₦{product.price.toLocaleString()}</p>
        
        {showMessageButton && (
          <Button
            onClick={handleMessageVendor}
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm py-1.5 sm:py-2"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Message Vendor</span>
            <span className="sm:hidden">Message</span>
          </Button>
        )}
      </div>
    </Link>
  )
}

export default ProductCard