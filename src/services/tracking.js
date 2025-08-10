import api from './api'

export const trackCustomerInterest = async (productId, vendorId, phoneNumber = null) => {
  try {
    // Get phone number from user or generate anonymous ID
    const customerPhone = phoneNumber || localStorage.getItem('customerPhone') || generateAnonymousId()
    
    await api.post('/automation/track-interest', {
      phoneNumber: customerPhone,
      productId,
      vendorId
    })
    
    // Store for future tracking
    if (!localStorage.getItem('customerPhone')) {
      localStorage.setItem('customerPhone', customerPhone)
    }
  } catch (error) {
    console.error('Failed to track interest:', error)
  }
}

const generateAnonymousId = () => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const trackProductView = (productId, vendorId) => {
  // Track product views for analytics
  const views = JSON.parse(localStorage.getItem('productViews') || '[]')
  views.push({
    productId,
    vendorId,
    timestamp: Date.now()
  })
  localStorage.setItem('productViews', JSON.stringify(views.slice(-50))) // Keep last 50
}