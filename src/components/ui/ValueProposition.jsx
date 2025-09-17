import { CheckCircle, MessageCircle, Store, Users, Zap } from 'lucide-react'

const ValueProposition = () => {
  const benefits = [
    {
      icon: Store,
      title: "Professional Storefronts",
      description: "No more blurry photos in chats. Browse beautiful, organized product catalogs that build trust and impress customers.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Organized Orders",
      description: "Stop the chaos of 'Hi, is this available?' Get clear, pre-filled messages with product details that save everyone time.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Discover New Vendors",
      description: "Find amazing local businesses you never knew existed. We help you discover quality vendors beyond your social circle.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Best of Both Worlds",
      description: "Professional shopping experience meets WhatsApp's personal touch. Get quality service without losing the human connection.",
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-blue-200/50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Why Vendly Changes Everything
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We solve the real problems of WhatsApp commerce - bringing order to chaos, 
          professionalism to informal selling, and discoverability to hidden gems.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-white text-center">
        <h3 className="text-xl font-bold mb-2">The Missing Link</h3>
        <p className="text-white/90">
          Vendly bridges the gap between social media discovery and WhatsApp communication. 
          We bring order, professionalism, and new customers to where vendors love to sell.
        </p>
      </div>
    </div>
  )
}

export default ValueProposition