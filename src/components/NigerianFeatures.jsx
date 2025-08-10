import { useState } from 'react'
import { MapPin, Truck, CreditCard, Phone } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'

const NigerianFeatures = ({ vendor, product }) => {
  const [selectedPayment, setSelectedPayment] = useState('transfer')
  const [selectedDelivery, setSelectedDelivery] = useState('pickup')

  const paymentMethods = [
    { id: 'transfer', label: 'Bank Transfer', icon: CreditCard, popular: true },
    { id: 'ussd', label: 'USSD Code', icon: Phone },
    { id: 'cash', label: 'Cash on Delivery', icon: Truck },
    { id: 'pos', label: 'POS Payment', icon: CreditCard }
  ]

  const deliveryOptions = [
    { id: 'pickup', label: 'Self Pickup', price: 0, time: 'Immediate' },
    { id: 'lagos', label: 'Lagos Delivery', price: 1500, time: '1-2 days' },
    { id: 'abuja', label: 'Abuja Delivery', price: 2000, time: '2-3 days' },
    { id: 'nationwide', label: 'Nationwide', price: 2500, time: '3-5 days' }
  ]

  const handleOrderNow = () => {
    const payment = paymentMethods.find(p => p.id === selectedPayment)
    const delivery = deliveryOptions.find(d => d.id === selectedDelivery)
    
    const orderDetails = `🛍️ *ORDER DETAILS*

📦 Product: ${product.name}
💰 Price: ₦${product.price.toLocaleString()}
🚚 Delivery: ${delivery.label} ${delivery.price > 0 ? `(₦${delivery.price.toLocaleString()})` : '(Free)'}
💳 Payment: ${payment.label}
⏰ Delivery Time: ${delivery.time}

*Total: ₦${(product.price + delivery.price).toLocaleString()}*

Please confirm this order and send payment details.`

    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(orderDetails)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Payment Methods */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Method
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedPayment === method.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <method.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{method.label}</span>
                {method.popular && (
                  <span className="text-xs bg-green-100 text-green-700 px-1 rounded">Popular</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Delivery Options */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Delivery Options
        </h3>
        <div className="space-y-2">
          {deliveryOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedDelivery(option.id)}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                selectedDelivery === option.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {option.price === 0 ? 'Free' : `₦${option.price.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-700">Product Price:</span>
          <span className="font-semibold">₦{product.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-700">Delivery:</span>
          <span className="font-semibold">
            ₦{deliveryOptions.find(d => d.id === selectedDelivery)?.price.toLocaleString() || '0'}
          </span>
        </div>
        <div className="border-t border-green-300 pt-3 flex items-center justify-between">
          <span className="font-bold text-gray-800">Total:</span>
          <span className="font-bold text-green-600 text-lg">
            ₦{(product.price + (deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0)).toLocaleString()}
          </span>
        </div>
      </Card>

      <Button onClick={handleOrderNow} className="w-full" size="lg">
        <Phone className="w-5 h-5" />
        Order Now via WhatsApp
      </Button>
    </div>
  )
}

export default NigerianFeatures