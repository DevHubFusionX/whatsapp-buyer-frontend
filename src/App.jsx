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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog/:vendorId" element={<ModernCatalogHome />} />
          <Route path="/catalog-enhanced/:vendorId" element={<EnhancedCatalogHome />} />
          <Route path="/catalog-old/:vendorId" element={<CatalogHome />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/category/:category" element={<ProductListPage />} />
          <Route path="/product/:productId" element={<ModernProductDetail />} />
          <Route path="/product-old/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<BuyerOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/vendor/:vendorId" element={<VendorProfile />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App