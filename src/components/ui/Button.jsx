const Button = ({ children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '', ...props }) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
  
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

export default Button