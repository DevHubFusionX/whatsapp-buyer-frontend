import ProductCard from './ProductCard'

const ProductGrid = ({ products, vendor, showMessageButtons = false }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
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