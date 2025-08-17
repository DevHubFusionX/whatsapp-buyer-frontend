import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import CatalogHome from './components/CatalogHome'
import EnhancedCatalogHome from './components/EnhancedCatalogHome'
import ModernCatalogHome from './components/ModernCatalogHome'
import ProductDetail from './components/ProductDetail'
import ModernProductDetail from './components/ModernProductDetail'
import ProductListPage from './components/ProductListPage'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'
import OrderTrackingPage from './components/OrderTrackingPage'
import VendorProfile from './components/VendorProfile'
import SearchPage from './components/SearchPage'
import WishlistPage from './components/WishlistPage'
import BuyerOrdersPage from './components/BuyerOrdersPage'
import BuyerProfile from './components/BuyerProfile'
import BuyerSignup from './components/auth/BuyerSignup'
import BuyerLogin from './components/auth/BuyerLogin'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<BuyerSignup />} />
          <Route path="/login" element={<BuyerLogin />} />
          <Route path="/catalog/:vendorId" element={
            <ProtectedRoute>
              <ModernCatalogHome />
            </ProtectedRoute>
          } />
          <Route path="/catalog-enhanced/:vendorId" element={
            <ProtectedRoute>
              <EnhancedCatalogHome />
            </ProtectedRoute>
          } />
          <Route path="/catalog-old/:vendorId" element={
            <ProtectedRoute>
              <CatalogHome />
            </ProtectedRoute>
          } />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/category/:category" element={<ProductListPage />} />
          <Route path="/product/:productId" element={
            <ProtectedRoute>
              <ModernProductDetail />
            </ProtectedRoute>
          } />
          <Route path="/product-old/:productId" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <BuyerOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          } />
          <Route path="/vendor/:vendorId" element={<VendorProfile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <BuyerProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App