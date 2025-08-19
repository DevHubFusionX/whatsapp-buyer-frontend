import { Link } from 'react-router-dom'
import { FaHome, FaSearch } from 'react-icons/fa'

const NotFound = ({ type = 'page' }) => {
  const content = {
    page: {
      icon: '🔍',
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.'
    },
    store: {
      icon: '🏪',
      title: 'Store Not Found',
      description: 'This store is not available or may have been removed.'
    },
    product: {
      icon: '📦',
      title: 'Product Not Found',
      description: 'This product is no longer available or has been removed.'
    }
  }

  const { icon, title, description } = content[type]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">{icon}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/home"
            className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            <FaHome className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/search"
            className="flex items-center justify-center space-x-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <FaSearch className="w-4 h-4" />
            <span>Search Products</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound