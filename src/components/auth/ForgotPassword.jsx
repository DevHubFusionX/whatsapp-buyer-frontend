import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaKey, FaLock, FaArrowLeft } from 'react-icons/fa'
import { buyerAPI } from '../../services/api'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Email is invalid' })
      return
    }

    setLoading(true)
    try {
      await buyerAPI.forgotPassword({ email: formData.email })
      setStep(2)
      setErrors({})
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to send OTP' })
    }
    setLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!formData.otp.trim()) {
      setErrors({ otp: 'OTP is required' })
      return
    }

    setLoading(true)
    try {
      await buyerAPI.verifyOTP({ email: formData.email, otp: formData.otp })
      setStep(3)
      setErrors({})
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Invalid OTP' })
    }
    setLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.newPassword) newErrors.newPassword = 'Password is required'
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters'
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await buyerAPI.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      })
      navigate('/login', { state: { message: 'Password reset successfully! Please login with your new password.' } })
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to reset password' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaKey className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            {step === 1 && "Enter your email to receive OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create your new password"}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-200 mb-6">
              {errors.submit}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaKey className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength="6"
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest ${
                      errors.otp ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}
                  />
                </div>
                {errors.otp && <p className="text-red-600 text-sm mt-2">{errors.otp}</p>}
                <p className="text-sm text-gray-500 mt-2 text-center">
                  OTP sent to {formData.email}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}
                  />
                </div>
                {errors.newPassword && <p className="text-red-600 text-sm mt-2">{errors.newPassword}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-2">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center justify-center space-x-2">
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword