import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import Rating from './Rating'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      state={product}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative m-2 rounded-lg bg-[#f5f6f7] p-4">
        <ProductImage
          src={product.thumbnail}
          alt={product.title}
          className="aspect-square w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute left-2 top-2 rounded bg-white/95 px-2 py-1 text-[10px] font-semibold text-emerald-700">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">
          {product.brand || product.category.replaceAll('-', ' ')}
        </p>
        <h2 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5">{product.title}</h2>
        <Rating value={product.rating} />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold tracking-tight">${product.price.toFixed(2)}</p>
          <ArrowUpRight size={18} className="text-slate-400 group-hover:text-blue-600" />
        </div>
      </div>
    </Link>
  )
}
