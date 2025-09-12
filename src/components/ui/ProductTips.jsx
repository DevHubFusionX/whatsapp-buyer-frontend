import { useState } from 'react'
import { Lightbulb, X, Star, MessageCircle, Shield, Clock } from 'lucide-react'

const ProductTips = ({ isVisible, onClose }) => {
  const tips = [
    {
      icon: MessageCircle,
      title: 'Ask Questions',
      description: 'Don\'t hesitate to ask vendors about product details, availability, or customization options.',
      color: 'text-blue-500 bg-blue-50'
    },
    {
      icon: Star,
      title: 'Check Reviews',
      description: 'Look for vendor ratings and customer feedback to make informed purchasing decisions.',
      color: 'text-yellow-500 bg-yellow-50'
    },
    {
      icon: Shield,
      title: 'Verify Before Payment',
      description: 'Always confirm product details, price, and delivery terms before making payment.',
      color: 'text-green-500 bg-green-50'
    },
    {
      icon: Clock,
      title: 'Be Patient',
      description: 'Vendors may take time to respond. Most are active during business hours (9 AM - 6 PM).',
      color: 'text-purple-500 bg-purple-50'
    }
  ]

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">💡 Shopping Tips</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tip.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">{tip.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductTips