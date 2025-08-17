import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaSearch, FaShoppingCart, FaUser, FaBell } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('buyerName') || 'User'
    setUserName(name)
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.length)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <FaShoppingCart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">VendorTool</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-green-600">
                <FaBell className="w-5 h-5" />
              </button>
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{userName}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-16">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <Link 
            to="/home" 
            className={`flex flex-col items-center p-2 ${isActive('/home') ? 'text-green-600' : 'text-gray-400'}`}
          >
            <FaHome className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`flex flex-col items-center p-2 ${isActive('/search') ? 'text-green-600' : 'text-gray-400'}`}
          >
            <FaSearch className="w-5 h-5 mb-1" />
            <span className="text-xs">Search</span>
          </Link>
          
          <Link 
            to="/cart" 
            className={`flex flex-col items-center p-2 relative ${isActive('/cart') ? 'text-green-600' : 'text-gray-400'}`}
          >
            <FaShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link 
            to="/orders" 
            className={`flex flex-col items-center p-2 ${isActive('/orders') ? 'text-green-600' : 'text-gray-400'}`}
          >
            <FaUser className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Layout