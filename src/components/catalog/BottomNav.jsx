import { Home, Search, MessageCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const BottomNav = ({ vendor }) => {
  const location = useLocation()
  
  const handleContactVendor = () => {
    const message = `Hi! I'm browsing your catalog and interested in your products.`
    const whatsappUrl = `https://wa.me/${vendor?.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const navItems = [
    { icon: Home, label: 'Home', path: `/catalog/${vendor?.catalogId}`, active: location.pathname === `/catalog/${vendor?.catalogId}` },
    { icon: Search, label: 'Search', path: `/search/${vendor?.catalogId}`, active: location.pathname === `/search/${vendor?.catalogId}` },
    { icon: MessageCircle, label: 'Contact', onClick: handleContactVendor, active: false }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-20">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Component = item.path ? Link : 'button'
          return (
            <Component
              key={index}
              to={item.path}
              onClick={item.onClick}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Component>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav