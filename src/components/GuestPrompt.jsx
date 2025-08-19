import { Link } from 'react-router-dom'
import { FaUser, FaUserPlus } from 'react-icons/fa'

const GuestPrompt = ({ message = "Sign up to track your orders and save favorites!" }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FaUser className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Join our community!</p>
            <p className="text-xs text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/login"
            className="text-xs bg-white text-green-600 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-xs bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
          >
            <FaUserPlus className="w-3 h-3" />
            <span>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GuestPrompt