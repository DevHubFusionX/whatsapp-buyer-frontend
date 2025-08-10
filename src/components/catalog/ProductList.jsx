import { Package, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const ProductList = ({ products, vendor, showMessageButtons = false }) => {
  const handleMessageVendor = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!vendor || !product) return
    
    const message = `Hello, I am interested in ${product.name} for ₦${product.price.toLocaleString()}.`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <Link
            to={`/product/${product._id}?vendor=${product.vendor}`}
            className="p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 block"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
              ) : (
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 mb-1 truncate text-sm sm:text-base">{product.name}</h3>
              <p className="text-lg sm:text-xl font-bold text-green-600">₦{product.price.toLocaleString()}</p>
            </div>
          </Link>
          
          {showMessageButtons && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <Button
                onClick={(e) => handleMessageVendor(e, product)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Message Vendor</span>
                <span className="sm:hidden">Message</span>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProductList