import { useState, useEffect } from 'react'
import { ArrowLeft, User, Phone, Mail, MapPin, Heart, ShoppingBag, Bell, Settings, HelpCircle, LogOut, Edit3, Save, X, Sparkles, Star, Clock, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const BuyerProfile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: localStorage.getItem('buyerName') || 'Guest User',
    phone: localStorage.getItem('buyerPhone') || '',
    email: localStorage.getItem('buyerEmail') || '',
    address: localStorage.getItem('buyerAddress') || ''
  })
  const [editForm, setEditForm] = useState(profile)
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    recentOrders: []
  })

  useEffect(() => {
    // Load user stats
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]')
    
    setStats({
      totalOrders: recentOrders.length,
      wishlistItems: wishlist.length,
      recentOrders: recentOrders.slice(0, 3)
    })
  }, [])

  const handleSave = () => {
    setProfile(editForm)
    localStorage.setItem('buyerName', editForm.name)
    localStorage.setItem('buyerPhone', editForm.phone)
    localStorage.setItem('buyerEmail', editForm.email)
    localStorage.setItem('buyerAddress', editForm.address)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const menuItems = [
    { icon: ShoppingBag, label: 'My Orders', path: '/orders', color: 'from-blue-500 to-blue-600' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', color: 'from-red-500 to-pink-500', badge: stats.wishlistItems },
    { icon: Bell, label: 'Notifications', path: '/notifications', color: 'from-yellow-500 to-orange-500' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'from-gray-500 to-gray-600' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help', color: 'from-green-500 to-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">My Profile</h1>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-2xl hover:bg-green-200 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 font-medium">Verified Buyer</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Trusted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={isEditing ? editForm.name : profile.name}
                onChange={(e) => isEditing && setEditForm({...editForm, name: e.target.value})}
                disabled={!isEditing}
                className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl transition-colors ${
                  isEditing 
                    ? 'bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                    : 'bg-gray-50 text-gray-700'
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={isEditing ? editForm.phone : profile.phone}
                onChange={(e) => isEditing && setEditForm({...editForm, phone: e.target.value})}
                disabled={!isEditing}
                className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl transition-colors ${
                  isEditing 
                    ? 'bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                    : 'bg-gray-50 text-gray-700'
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={isEditing ? editForm.email : profile.email}
                onChange={(e) => isEditing && setEditForm({...editForm, email: e.target.value})}
                disabled={!isEditing}
                className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl transition-colors ${
                  isEditing 
                    ? 'bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                    : 'bg-gray-50 text-gray-700'
                }`}
              />
            </div>

            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                placeholder="Default Address"
                value={isEditing ? editForm.address : profile.address}
                onChange={(e) => isEditing && setEditForm({...editForm, address: e.target.value})}
                disabled={!isEditing}
                rows={3}
                className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl transition-colors resize-none ${
                  isEditing 
                    ? 'bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                    : 'bg-gray-50 text-gray-700'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
                <p className="text-sm text-gray-600">Wishlist Items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {stats.recentOrders.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <Link to="/orders" className="text-green-600 font-medium text-sm hover:text-green-700">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Order #{index + 1}</p>
                      <p className="text-xs text-gray-600">2 days ago</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold">₦12,500</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link
                key={item.label}
                to={item.path}
                className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180 group-hover:text-green-600 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear()
            navigate('/')
          }}
          className="w-full bg-red-50 text-red-600 py-4 rounded-3xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2 border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default BuyerProfile