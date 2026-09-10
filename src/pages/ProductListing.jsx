import { useCallback, useState } from 'react'
import Filters from '../components/Filters'
import ListingHeader from '../components/ListingHeader'
import ProductResults from '../components/ProductResults'
import Feedback, { ProductSkeletons } from '../components/Feedback'
import useFetchData from '../hooks/useFetchData'
import { API } from '../api/main'

const LIMIT = 12
const sortMap = {
  featured: ['', ''],
  'price-asc': ['price', 'asc'],
  'price-desc': ['price', 'desc'],
  'rating-desc': ['rating', 'desc'],
}

export default function ProductListing() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const catalog = useFetchData(API.ALL_PRODUCTS(0, 0))
  const brands = [
    ...new Set((catalog.data?.products ?? []).map((product) => product.brand?.trim()).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))
  const [resetKey, setResetKey] = useState(0)
  const skip = (page - 1) * LIMIT

  const [sortBy, order] = sortMap[sort]
  const filterLocally = Boolean(brand || minPrice !== '' || maxPrice !== '' || (category && search.trim()))
  const { data, loading, error, retry } = useFetchData(
    API.ALL_PRODUCTS(filterLocally ? 0 : LIMIT, filterLocally ? 0 : skip, search, sortBy, order, category),
  )
  const matchingProducts = (data?.products ?? []).filter(
    (product) =>
      (!category || product.category === category) &&
      (!brand || product.brand?.trim() === brand) &&
      (minPrice === '' || product.price >= Number(minPrice)) &&
      (maxPrice === '' || product.price <= Number(maxPrice)),
  )
  const products = filterLocally ? matchingProducts.slice(skip, skip + LIMIT) : matchingProducts

  const handleSearch = useCallback((value) => {
    setSearch(value)
    setPage(1)
  }, [])

  function handleChangePage(nextPage) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function handleCategory(value) {
    setCategory(value)
    setPage(1)
  }
  return (
    <>
      <ListingHeader key={resetKey} search={search} onSearch={handleSearch} />
      <div className="grid items-start gap-7 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
          <Filters
            brands={brands}
            brandsLoading={catalog.loading}
            brandsError={catalog.error}
            onBrandsRetry={catalog.retry}
            selectedBrand={brand}
            onBrandChange={(value) => {
              setBrand(value)
              setPage(1)
            }}
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(value) => {
              setMinPrice(value)
              setPage(1)
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value)
              setPage(1)
            }}
            onCategoryChange={handleCategory}
            onReset={() => {
              setCategory('')
              setBrand('')
              setMinPrice('')
              setMaxPrice('')
              setSearch('')
              setSort('featured')
              setPage(1)
              setResetKey((key) => key + 1)
            }}
          />
        </div>
        {loading ? (
          <ProductSkeletons />
        ) : error ? (
          <Feedback title="Unable to load products" message={error.message} onRetry={retry} action="Retry" />
        ) : (
          <ProductResults
            products={products}
            total={filterLocally ? matchingProducts.length : (data?.total ?? 0)}
            page={page}
            pageSize={LIMIT}
            onPageChange={handleChangePage}
            sort={sort}
            onSort={(value) => {
              setSort(value)
              setPage(1)
            }}
          />
        )}
      </div>
    </>
  )
}
