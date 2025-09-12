import { Link } from 'react-router-dom'
import { FaUser, FaUserPlus } from 'react-icons/fa'

const GuestPrompt = ({ message = "Sign up to track your orders and save favorites!" }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 sm:p-4 border border-green-200 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FaUser className="w-5 h-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">Join our community!</p>
            <p className="text-xs text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex space-x-2 sm:flex-shrink-0">
          <Link
            to="/login"
            className="flex-1 sm:flex-none text-xs sm:text-sm bg-white text-green-600 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-center font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="flex-1 sm:flex-none text-xs sm:text-sm bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-1 font-medium"
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