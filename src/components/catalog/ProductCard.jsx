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
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 block"
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="w-8 h-8 text-gray-300" />
        )}
        
        {showMessageButton && (
          <button
            onClick={handleMessageVendor}
            className="absolute top-2 right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-lg font-bold text-green-600 mb-2">₦{product.price.toLocaleString()}</p>
        
        {showMessageButton && (
          <Button
            onClick={handleMessageVendor}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <MessageCircle className="w-4 h-4" />
            Message Vendor
          </Button>
        )}
      </div>
    </Link>
  )
}

export default ProductCard