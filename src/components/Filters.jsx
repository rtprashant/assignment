import { SlidersHorizontal } from 'lucide-react'
import useFetchData from '../hooks/useFetchData'
import { API } from '../api/main'

function preventMinus(event) {
  if (event.key === '-') event.preventDefault()
}

function preventNegativePaste(event) {
  if (event.clipboardData.getData('text').includes('-')) event.preventDefault()
}

function changePrice(event, previousValue, onChange) {
  const value = event.target.value
  if (value.includes('-') || (value !== '' && Number(value) < 0)) {
    event.target.value = previousValue
    return
  }
  onChange?.(value)
}

export default function Filters({
  brands = [],
  brandsLoading,
  brandsError,
  onBrandsRetry,
  selectedBrand = '',
  onBrandChange,
  selectedCategory = '',
  onCategoryChange,
  minPrice = '',
  maxPrice = '',
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}) {
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
    retry,
  } = useFetchData(API.CATEGORIES)
  const apiCategories = Array.isArray(categoryData) ? categoryData : (categoryData?.categories ?? [])
  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-5"
      onSubmit={(event) => event.preventDefault()}
      onReset={onReset}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal size={17} /> Filters
        </h2>
        <button type="reset" className="text-xs font-medium text-blue-700 hover:underline">
          Reset all
        </button>
      </div>
      <fieldset className="border-t border-slate-100 py-5">
        <legend className="sr-only">Category</legend>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</p>
        {categoryLoading && (
          <p role="status" className="text-sm text-slate-500">
            Loading categories…
          </p>
        )}
        {categoryError && (
          <button type="button" onClick={retry} className="mb-2 text-sm text-red-700">
            Unable to load categories. Retry
          </button>
        )}
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {[{ slug: '', name: 'All products' }, ...apiCategories].map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 has-checked:bg-blue-50 has-checked:text-blue-700"
            >
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={selectedCategory === category.slug}
                onChange={() => onCategoryChange?.(category.slug)}
                className="size-3.5 shrink-0 accent-blue-600"
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="border-t border-slate-100 py-5">
        <legend className="sr-only">Price range</legend>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Price range (USD)
        </p>
        <div className="flex gap-2">
          <label className="min-w-0 flex-1">
            <span className="mb-1.5 block text-xs text-slate-500">Min price</span>
            <input
              className="field"
              name="min"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={minPrice}
              onKeyDown={preventMinus}
              onPaste={preventNegativePaste}
              onChange={(event) => changePrice(event, minPrice, onMinPriceChange)}
            />
          </label>
          <label className="min-w-0 flex-1">
            <span className="mb-1.5 block text-xs text-slate-500">Max price</span>
            <input
              className="field"
              name="max"
              type="number"
              min="0"
              step="0.01"
              placeholder="Any"
              value={maxPrice}
              onKeyDown={preventMinus}
              onPaste={preventNegativePaste}
              onChange={(event) => changePrice(event, maxPrice, onMaxPriceChange)}
            />
          </label>
        </div>
      </fieldset>
      <div className="border-t border-slate-100 pt-5">
        <label
          htmlFor="brand"
          className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          Brand
        </label>
        {brandsLoading && (
          <p role="status" className="mb-2 text-sm text-slate-500">
            Loading brands...
          </p>
        )}
        {brandsError && (
          <button type="button" onClick={onBrandsRetry} className="mb-2 text-sm text-red-700">
            Unable to load brands. Retry
          </button>
        )}
        <select
          id="brand"
          name="brand"
          className="field"
          value={selectedBrand}
          onChange={(event) => onBrandChange?.(event.target.value)}
          disabled={brandsLoading || Boolean(brandsError)}
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>
      </div>
    </form>
  )
}
