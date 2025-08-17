import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt, FaEdit } from 'react-icons/fa'
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

  useEffect(() => {
    // Load profile from localStorage
    const name = localStorage.getItem('buyerName') || ''
    const email = localStorage.getItem('buyerEmail') || ''
    setProfile(prev => ({ ...prev, name, email }))
  }, [])

  const handleSave = () => {
    // Save to localStorage (in real app, save to backend)
    localStorage.setItem('buyerName', profile.name)
    setIsEditing(false)
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
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaEdit className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name || 'User'}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50' : ''
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50' : ''
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50' : ''
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="address"
                placeholder="Address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                  !isEditing ? 'bg-gray-50' : ''
                }`}
              />
            </div>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 mt-8"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default BuyerProfile