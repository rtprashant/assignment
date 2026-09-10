import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ProductGallery from '../components/ProductGallery'
import ProductInfo from '../components/ProductInfo'
import ProductReviews from '../components/ProductReviews'
import Feedback from '../components/Feedback'
import useFetchData from '../hooks/useFetchData'
import { API } from '../api/main'

export default function ProductDetail() {
  const { id } = useParams()
  const { data: product, loading, error, retry } = useFetchData(API.SINGLE_PRODUCT(id))

  return (
    <>
      <Link
        to="/"
        className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
      >
        <ArrowLeft size={17} /> Back to products
      </Link>
      {loading ? (
        <div
          role="status"
          className="rounded-xl bg-slate-100 py-40 text-center text-slate-500 motion-safe:animate-pulse"
        >
          Loading product…
        </div>
      ) : error ? (
        <Feedback title="Unable to load product" message={error.message} onRetry={retry} action="Retry" />
      ) : product ? (
        <>
          <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-14">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>
          <ProductReviews reviews={product.reviews} rating={product.rating} />
        </>
      ) : (
        <Feedback
          title="Product not found"
          message="No product data was returned."
          onRetry={retry}
          action="Retry"
        />
      )}
    </>
  )
}
