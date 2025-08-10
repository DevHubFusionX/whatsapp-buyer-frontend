import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = "Search products..." }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
      />
    </div>
  )
}

export default SearchBar