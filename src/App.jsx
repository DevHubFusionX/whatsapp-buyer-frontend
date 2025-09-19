import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LandingPage from './components/LandingPage'
import HomePage from './components/HomePage'
import ProductDetail from './components/ProductDetail'

import SearchPage from './components/SearchPage'
import VendorStorePage from './components/VendorStorePage'
import VendorStoresPage from './components/VendorStoresPage'
import ModernCatalogHome from './components/ModernCatalogHome'
import BuyerProfile from './components/BuyerProfile'
import BuyerSignup from './components/auth/BuyerSignup'
import BuyerLogin from './components/auth/BuyerLogin'
import ForgotPassword from './components/auth/ForgotPassword'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<BuyerSignup />} />
          <Route path="/login" element={<BuyerLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/store/:vendorId" element={<VendorStorePage />} />
          <Route path="/catalog/:catalogId" element={<ModernCatalogHome />} />
          <Route path="/product/:productId" element={<ProductDetail />} />

          <Route path="/stores" element={<VendorStoresPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <BuyerProfile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App