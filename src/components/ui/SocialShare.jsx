import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter, Instagram } from 'lucide-react'

const SocialShare = ({ product, productUrl }) => {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareText = `🛍️ Check out this amazing product!\n\n📦 ${product.name}\n💰 ₦${product.price?.toLocaleString()}\n\n${product.description ? `${product.description}\n\n` : ''}🔗 Shop now: ${productUrl}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, '_blank')
    setShowModal(false)
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
    window.open(facebookUrl, '_blank')
    setShowModal(false)
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on Vendly!`)}&url=${encodeURIComponent(productUrl)}`
    window.open(twitterUrl, '_blank')
    setShowModal(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="group w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/50 flex items-center justify-center hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all transform hover:scale-105 active:scale-95"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
      </button>

      {showModal && (
        <>
          <div 
            className="fixed inset-0 z-[55]"
            onClick={() => setShowModal(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-[60]">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Share Product</h3>
              
              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-green-700">WhatsApp</span>
                </button>

                <button
                  onClick={handleFacebookShare}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-blue-700">Facebook</span>
                </button>

                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center space-x-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                    <Twitter className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-sky-700">Twitter</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    copied ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    copied ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {copied ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    copied ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {copied ? 'Link Copied!' : 'Copy Link'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SocialShare