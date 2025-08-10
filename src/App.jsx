import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CatalogHome from './components/CatalogHome'
import ProductDetail from './components/ProductDetail'
import VendorProfile from './components/VendorProfile'
import SearchPage from './components/SearchPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/catalog/:vendorId" element={<CatalogHome />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/vendor/:vendorId" element={<VendorProfile />} />
          <Route path="/search/:vendorId" element={<SearchPage />} />
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="text-center max-w-md mx-auto">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome to VendorTool</h1>
                <p className="text-sm sm:text-base text-gray-600">Please use a valid catalog link to view a vendor's products.</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App