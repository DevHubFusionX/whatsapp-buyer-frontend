import { MessageCircle, Package, Plus, Star, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product, vendor, onMessage, onAddToCart, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleChatClick = (e) => {
    e.stopPropagation()
    const message = `Hi! I'm interested in *${product.name}* for ₦${product.price.toLocaleString()}. Is it available?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    onAddToCart && onAddToCart(product)
  }

  return (
    <Link to={`/product/${product._id}`} className={`block group ${className}`}>
      <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
          {product.image ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorite(!isFavorite)
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
            {onAddToCart && (
              <button
                onClick={handleAddToCart}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
              >
                <Plus className="w-5 h-5 text-green-600" />
              </button>
            )}
          </div>
          
          {/* Quick View Badge */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              Quick View
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-4">
          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₦{product.price.toLocaleString()}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-gray-400 line-through">
                  ₦{product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-700">4.8</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleChatClick}
            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-4 px-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 min-h-[48px] group-hover:from-green-600 group-hover:to-emerald-700"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard