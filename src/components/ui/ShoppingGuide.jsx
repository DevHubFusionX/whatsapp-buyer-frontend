import { useState } from 'react'
import { X, ShoppingCart, MessageCircle, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react'

const ShoppingGuide = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 'browse',
      title: '🛍️ Browse Products',
      description: 'Explore thousands of products from local vendors',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">No signup required! Start browsing immediately:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Search by product name or category</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Filter by price range and location</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>View detailed product photos and descriptions</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'contact',
      title: '💬 Contact Vendor',
      description: 'Chat directly with vendors on WhatsApp',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Found something you like? Contact the vendor instantly:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>Click "Order on WhatsApp" button</span>
            </li>
            <li className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>Ask about availability, sizes, colors</span>
            </li>
            <li className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>Negotiate price and delivery options</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'purchase',
      title: '✅ Complete Purchase',
      description: 'Finalize your order with the vendor',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Complete your purchase directly with the vendor:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Agree on payment method (cash, transfer, etc.)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Confirm delivery address and time</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Receive your order and enjoy!</span>
            </li>
          </ul>
        </div>
      )
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shopping Guide</h2>
              <p className="text-sm text-gray-500">Learn how to shop with us</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            {steps[currentStep].content}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-all font-medium"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-all font-medium"
              >
                <span>Start Shopping</span>
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingGuide