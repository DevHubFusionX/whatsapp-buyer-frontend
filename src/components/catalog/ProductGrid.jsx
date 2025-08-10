import ProductCard from './ProductCard'

const ProductGrid = ({ products, vendor, showMessageButtons = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          vendor={vendor}
          showMessageButton={showMessageButtons}
        />
      ))}
    </div>
  )
}

export default ProductGrid