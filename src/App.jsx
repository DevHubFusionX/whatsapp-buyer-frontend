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

const AuthenticatedLandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('buyerToken')
    setIsAuthenticated(!!token)
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<AuthenticatedLandingPage />} />
          <Route path="/signup" element={<BuyerSignup />} />
          <Route path="/login" element={<BuyerLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } />
          <Route path="/store/:vendorId" element={
            <ProtectedRoute>
              <VendorStorePage />
            </ProtectedRoute>
          } />
          <Route path="/catalog/:catalogId" element={
            <ProtectedRoute>
              <ModernCatalogHome />
            </ProtectedRoute>
          } />
          <Route path="/product/:productId" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <VendorStoresPage />
            </ProtectedRoute>
          } />
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