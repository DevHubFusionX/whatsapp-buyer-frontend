const LoadingSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
  )
}

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <LoadingSkeleton className="aspect-square" />
      <div className="p-3 space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-5 w-1/2" />
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-3 w-16" />
          <LoadingSkeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  )
}

export const VendorCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-3 w-24" />
        </div>
        <LoadingSkeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export const HomePageSkeleton = () => {
  return (
    <div className="p-4 space-y-6">
      <LoadingSkeleton className="h-12 rounded-xl" />
      <div>
        <LoadingSkeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-3">
              <LoadingSkeleton className="w-12 h-12 rounded-xl mx-auto mb-2" />
              <LoadingSkeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <LoadingSkeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton