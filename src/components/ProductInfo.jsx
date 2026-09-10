import { Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import Rating from './Rating'

export default function ProductInfo({ product }) {
  return (
    <div className="py-2">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-700">{product.category}</p>
      <h1 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">{product.title}</h1>
      <div className="mt-4">
        <Rating value={product.rating} />
      </div>
      <div className="my-6 flex flex-wrap items-center gap-3">
        <p className="text-4xl font-bold tracking-tight">${product.price.toFixed(2)}</p>
        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          In Stock
        </span>
      </div>
      <dl className="grid grid-cols-[90px_1fr] gap-y-3 border-y border-slate-200 py-5 text-sm">
        <dt className="text-slate-500">Brand</dt>
        <dd className="font-medium">{product.brand}</dd>
        <dt className="text-slate-500">Category</dt>
        <dd className="capitalize">{product.category}</dd>
      </dl>
      <h2 className="mb-3 mt-6 font-semibold">About this product</h2>
      <p className="text-sm leading-7 text-slate-600">
        {product.description ||
          'An everyday essential for your collection. This sample description can be replaced with your product data.'}
      </p>
      <div className="mt-7 space-y-4 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="flex items-center gap-3">
          <Truck size={18} />
          Ships in 3–5 business days
        </p>
        <p className="flex items-center gap-3">
          <ShieldCheck size={18} />1 year warranty
        </p>
        <p className="flex items-center gap-3">
          <RotateCcw size={18} />
          30 day returns
        </p>
      </div>
    </div>
  )
}
