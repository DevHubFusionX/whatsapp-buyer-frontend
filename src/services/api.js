import axios from 'axios';

const API_BASE_URL = 'https://whatsapp-vendor.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buyerToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('buyerToken')
      localStorage.removeItem('buyerId')
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const vendorsAPI = {
  getVendorCatalog: (catalogId) => api.get(`/vendors/${catalogId}`)
};

export const buyerAPI = {
  getVendors: (params) => api.get('/buyer/vendors', { params }),
  getProducts: (params) => api.get('/buyer/products', { params }),
  getFeaturedProducts: () => api.get('/buyer/products/featured'),
  getProduct: (productId) => api.get(`/buyer/products/${productId}`),
  createOrder: (orderData) => api.post('/buyer/orders', orderData),
  trackOrder: (trackingData) => api.post('/buyer/track-order', trackingData),
  trackInterest: (data) => api.post('/buyer/track-interest', data),
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/buyer/profile'),
  updateProfile: (profileData) => api.put('/buyer/profile', profileData),
  logInteraction: (interactionData) => api.post('/buyer/interactions', interactionData),
  checkAuth: () => api.get('/buyer/auth-check')
};

export default api;