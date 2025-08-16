import axios from 'axios';

const API_BASE_URL = 'https://whatsapp-vendor.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

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
  trackInterest: (data) => api.post('/buyer/track-interest', data)
};

export default api;