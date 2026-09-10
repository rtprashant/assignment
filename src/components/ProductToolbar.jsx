export default function ProductToolbar({ title = 'All products', count = 0, sort = 'featured', onSort }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{count} products</p>
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-500">
        Sort by
        <select
          name="sort"
          className="field !w-auto"
          value={sort}
          onChange={(event) => onSort?.(event.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Top rated</option>
        </select>
      </label>
    </div>
  )
}
