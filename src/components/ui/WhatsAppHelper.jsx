import { MessageCircle, Phone, Clock, CheckCircle } from 'lucide-react'

const WhatsAppHelper = ({ vendor, product, className = "" }) => {
  const generateMessage = () => {
    if (product) {
      return `Hi! I'm interested in this product:\n\n📦 ${product.name}\n💰 ₦${product.price?.toLocaleString()}\n\nIs it available? Can you tell me more about it?`
    }
    return `Hi! I'm browsing your store and interested in your products. Can you help me find what I'm looking for?`
  }

  const handleWhatsAppClick = () => {
    const message = generateMessage()
    const phoneNumber = vendor?.phoneNumber?.replace(/\D/g, '') || vendor?.phone?.replace(/\D/g, '')
    
    if (!phoneNumber) {
      alert('Vendor contact information not available')
      return
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">Contact Vendor</h3>
          <p className="text-white/90 text-sm">Chat directly on WhatsApp</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-white/90">
          <CheckCircle className="w-4 h-4" />
          <span>Instant messaging</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-white/90">
          <Phone className="w-4 h-4" />
          <span>Direct communication</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-white/90">
          <Clock className="w-4 h-4" />
          <span>Quick responses</span>
        </div>
      </div>

      <button
        onClick={handleWhatsAppClick}
        className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:scale-105 flex items-center justify-center space-x-2"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Order on WhatsApp</span>
      </button>

      <p className="text-xs text-white/70 mt-2 text-center">
        💡 Tip: Ask about availability, sizes, and delivery options
      </p>
    </div>
  )
}

export default WhatsAppHelper