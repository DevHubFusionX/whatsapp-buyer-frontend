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
  signup: (userData) => api.post('/auth/buyer/signup', userData),
  login: (credentials) => api.post('/auth/buyer/login', credentials),
  getProfile: () => api.get('/auth/buyer/profile'),
  updateProfile: (profileData) => api.put('/auth/buyer/profile', profileData),
  logInteraction: (interactionData) => api.post('/buyer/interactions', interactionData)
};

export default api;