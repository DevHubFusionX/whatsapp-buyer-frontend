import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt, FaEdit, FaShoppingBag, FaHeart, FaQuestionCircle, FaShieldAlt, FaInfoCircle } from 'react-icons/fa'
import { MdVerified, MdInfo, MdSecurity, MdHistory, MdSettings } from 'react-icons/md'
import { User, Mail, Phone, MapPin, LogOut, Edit3, ShoppingBag, Heart, Settings, Shield, Info, HelpCircle, CheckCircle, Star, Award } from 'lucide-react'
import { buyerAPI } from '../services/api'
import Layout from './Layout'

const BuyerProfile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('buyerToken')
        if (token) {
          const response = await buyerAPI.getProfile()
          const buyerData = response.data.buyer
          setProfile({
            name: buyerData.name || '',
            email: buyerData.email || '',
            phone: buyerData.phone || '',
            address: buyerData.address || ''
          })
        } else {
          // Load from localStorage as fallback
          const name = localStorage.getItem('buyerName') || ''
          const email = localStorage.getItem('buyerEmail') || ''
          setProfile(prev => ({ ...prev, name, email }))
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        // Load from localStorage as fallback
        const name = localStorage.getItem('buyerName') || ''
        const email = localStorage.getItem('buyerEmail') || ''
        setProfile(prev => ({ ...prev, name, email }))
      }
    }
    
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('buyerToken')
      if (token) {
        await buyerAPI.updateProfile({
          name: profile.name,
          phone: profile.phone,
          address: profile.address
        })
        // Update localStorage
        localStorage.setItem('buyerName', profile.name)
        alert('Profile updated successfully!')
      } else {
        // Save to localStorage as fallback
        localStorage.setItem('buyerName', profile.name)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('buyerToken')
    localStorage.removeItem('buyerId')
    localStorage.removeItem('buyerName')
    localStorage.removeItem('buyerEmail')
    localStorage.removeItem('cart')
    navigate('/')
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
        {/* Enhanced Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all transform hover:scale-105"
            >
              <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Profile</h1>
              <p className="text-xs text-gray-500">Manage your account</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHelp(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 hover:bg-blue-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all transform hover:scale-105"
              >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 hover:bg-green-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all transform hover:scale-105"
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Help Guide */}
          {showHelp && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-900">Profile Help Guide</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-blue-600 hover:text-blue-800 font-bold text-xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">Keep Your Info Updated</h4>
                    <p className="text-xs text-blue-700">Accurate contact details help vendors reach you for orders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">Add Your Address</h4>
                    <p className="text-xs text-blue-700">Complete address ensures smooth delivery of your orders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">Verify Your Phone</h4>
                    <p className="text-xs text-blue-700">WhatsApp-ready number for direct vendor communication</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Profile Header */}
          <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{profile.name || 'Welcome!'}</h2>
              <p className="text-white/90 text-sm sm:text-base mb-4">{profile.email || 'Complete your profile'}</p>
              
              {/* Profile Completion */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90 text-sm font-medium">Profile Completion</span>
                  <span className="text-white font-bold text-sm">75%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Verified Account</h3>
              <p className="text-xs text-gray-600">Email verified</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Orders Placed</h3>
              <p className="text-xs text-gray-600">5 successful</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Member Since</h3>
              <p className="text-xs text-gray-600">January 2024</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-600">Keep your details up to date for better service</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            <div className="space-y-4 sm:space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all text-sm sm:text-base ${
                      !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">💡 Use your real name for vendor communication</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all text-sm sm:text-base ${
                      !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">📧 We'll send order confirmations to this email</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your WhatsApp number"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all text-sm sm:text-base ${
                      !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">📱 Vendors will contact you on this WhatsApp number</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    placeholder="Enter your complete delivery address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-300 resize-none transition-all text-sm sm:text-base ${
                      !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">🏠 Include landmarks for easy delivery location</p>
                )}
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Account Security */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Account Security
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-900 text-sm">Email Verified</h4>
                    <p className="text-xs text-green-700">Your email is verified and secure</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">Privacy Protected</h4>
                    <p className="text-xs text-blue-700">Your data is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shopping Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 border border-purple-200/50">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              💡 Profile Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Complete Profile</h4>
                  <p className="text-xs text-gray-600 mt-1">Complete profiles get better service from vendors</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">WhatsApp Ready</h4>
                  <p className="text-xs text-gray-600 mt-1">Keep your WhatsApp number updated for smooth communication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout from Account</span>
              </button>
              <p className="text-xs text-gray-500 text-center">You can always log back in with your email and password</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Padding */}
        <div className="h-6"></div>
      </div>
    </Layout>
  )
}

export default BuyerProfile