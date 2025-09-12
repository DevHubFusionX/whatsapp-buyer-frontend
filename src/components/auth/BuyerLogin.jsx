import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStar } from 'react-icons/fa'
import { buyerAPI } from '../../services/api'

const BuyerLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await buyerAPI.login(formData)
      
      localStorage.setItem('buyerToken', response.data.token)
      localStorage.setItem('buyerId', response.data.user._id)
      localStorage.setItem('buyerName', response.data.user.name)
      localStorage.setItem('buyerEmail', response.data.user.email)

      if (formData.rememberMe) {
        localStorage.setItem('rememberBuyer', 'true')
      }

      const redirectTo = location.state?.from || '/home'
      navigate(redirectTo)
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaStar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600 mb-4">Sign in to continue shopping and track your orders</p>
          
          {/* Benefits of Signing In */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200/50">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">✨ Benefits of having an account:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Save favorites</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Track orders</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                <span>Order history</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Quick reorder</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm border border-green-200">
                {successMessage}
              </div>
            )}
            {errors.submit && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-200">
                {errors.submit}
              </div>
            )}

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 font-semibold hover:text-green-700">
                Create Account
              </Link>
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">💡 <strong>Remember:</strong> You can shop without an account!</p>
              <Link 
                to="/home" 
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Continue browsing without signing in →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerLogin