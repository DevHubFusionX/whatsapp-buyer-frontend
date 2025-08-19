const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionText,
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          onClick={action}
          className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState