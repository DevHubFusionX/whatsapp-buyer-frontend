const Button = ({ children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '', ...props }) => {
  const baseClasses = 'font-medium rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 focus:ring-2 focus:ring-offset-2 whitespace-nowrap'
  
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm',
    outline: 'border border-green-500 sm:border-2 text-green-600 hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  }
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm',
    md: 'px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base',
    lg: 'px-4 py-2.5 sm:px-6 sm:py-4 text-base sm:text-lg'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
  
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

export default Button