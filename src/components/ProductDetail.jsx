import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaWhatsapp } from 'react-icons/fa'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await buyerAPI.getProduct(productId)
        setProduct(response.data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [productId])

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item._id === product._id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    navigate('/cart')
  }

  const contactVendor = () => {
    const message = `Hi! I'm interested in ${product.name} - ₦${product.price?.toLocaleString()}`
    const whatsappUrl = `https://wa.me/${product.vendorPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
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

  if (!product) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <p className="text-gray-600">Product not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Product Details</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaHeart className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Product Image */}
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-6xl">📦</div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                <FaStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600">4.5 (120 reviews)</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">₦{product.price?.toLocaleString()}</p>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3 border-t">
          <button
            onClick={addToCart}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
          
          <button
            onClick={contactVendor}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span>Contact Vendor</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ProductDetail