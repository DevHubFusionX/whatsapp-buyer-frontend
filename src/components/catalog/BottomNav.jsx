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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 sm:px-4 py-2 z-20 safe-area-inset-bottom">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Component = item.path ? Link : 'button'
          return (
            <Component
              key={index}
              to={item.path}
              onClick={item.onClick}
              className={`flex flex-col items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors min-w-0 flex-1 ${
                item.active ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Component>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav