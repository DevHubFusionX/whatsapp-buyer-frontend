import { useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaWhatsapp, FaMapMarkerAlt, FaStar, FaArrowRight, FaUsers, FaBox, FaBolt } from 'react-icons/fa'

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: FaShoppingCart,
      title: 'No Signup Required',
      description: 'Start browsing immediately! No registration needed to explore products and order via WhatsApp'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp Integration',
      description: 'Chat directly with vendors via WhatsApp for instant communication and support'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Instant Ordering',
      description: 'Found something you like? Order instantly via WhatsApp with just one click'
    },
    {
      icon: FaStar,
      title: 'Optional Account',
      description: 'Sign up only if you want to track orders and save favorites - completely optional!'
    }
  ]

  const stats = [
    { icon: FaUsers, value: '10,000+', label: 'Happy Customers' },
    { icon: FaBox, value: '5,000+', label: 'Products Available' },
    { icon: FaBolt, value: '500+', label: 'Local Vendors' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center">
              <FaShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Vendly</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-[#25D366] hover:text-[#20BA5A] font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Browse Products,
            <span className="text-[#25D366]"> Order Instantly</span>
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            No signup required! Browse thousands of products from local vendors, 
            then order directly via WhatsApp. Simple, fast, and personal.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Direct WhatsApp Contact</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Local Vendors Only</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <FaShoppingCart className="w-6 h-6" />
              <span>Browse Products</span>
              <FaArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-2xl border-2 border-gray-200 transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <span>Sign Up (Optional)</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Shop With Vendly?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon
              return (
                <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#25D366] bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Shopping with us is as easy as 1-2-3! No complicated processes, just simple steps to get what you need.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">🔍 Discover Professional Stores</h4>
              <p className="text-gray-600">Browse organized, beautiful storefronts instead of scrolling through chaotic WhatsApp chats. Find exactly what you need with proper categories and search.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">💬 Send Clear Orders</h4>
              <p className="text-gray-600">No more confusion! Your WhatsApp message includes product name, price, and details. Vendors get organized orders instead of endless questions.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">✅ Enjoy Personal Service</h4>
              <p className="text-gray-600">Get the personal touch of WhatsApp communication with the professionalism of a real store. Best of both worlds!</p>
            </div>
          </div>
          
          {/* Additional Tips */}
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200/50">
            <h4 className="font-semibold text-gray-900 mb-3 text-center">💡 The Vendly Advantage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Professional product photos and descriptions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Pre-organized order messages save time</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Discover new vendors through our platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>No middleman - direct vendor communication</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Experience Professional Shopping!
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Discover organized storefronts from local vendors. Professional catalogs meet WhatsApp convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg inline-flex items-center space-x-2"
            >
              <FaShoppingCart className="w-6 h-6" />
              <span>Browse Products</span>
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-2xl border-2 border-gray-200 transition-colors text-lg"
            >
              Sign Up for Extras
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
              <FaShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Vendly</span>
          </div>
          <p className="text-gray-400">
            Your gateway to local vendor catalogs
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage