import axios from 'axios';

const API_BASE_URL = 'https://whatsapp-vendor.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export const vendorsAPI = {
  getVendorCatalog: (catalogId) => api.get(`/vendors/${catalogId}`)
};

export default api;