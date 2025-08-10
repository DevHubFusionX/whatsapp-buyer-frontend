import { useState } from 'react'
import { Phone, X } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'

const PhoneCapture = ({ onSubmit, onSkip }) => {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phone.length >= 10) {
      localStorage.setItem('customerPhone', phone)
      localStorage.setItem('customerName', name)
      onSubmit({ phone, name })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Stay Connected</h3>
          </div>
          <button onClick={onSkip} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">
          Get updates on your orders and special offers from this vendor!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 801 234 5678"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1" disabled={phone.length < 10}>
              Save Contact
            </Button>
            <Button type="button" variant="outline" onClick={onSkip}>
              Skip
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          We'll only use this to send you order updates and special offers
        </p>
      </Card>
    </div>
  )
}

export default PhoneCapture