const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card