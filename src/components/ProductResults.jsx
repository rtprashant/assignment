import ProductCard from './ProductCard'
import ProductToolbar from './ProductToolbar'
import Pagination from './Pagination'

export default function ProductResults({
  products = [],
  total = 0,
  page,
  pageSize,
  onPageChange,
  sort,
  onSort,
}) {
  return (
    <section aria-label="Products" className="min-w-0">
      <ProductToolbar count={total} sort={sort} onSort={onSort} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onPageChange={onPageChange} />
    </section>
  )
}
