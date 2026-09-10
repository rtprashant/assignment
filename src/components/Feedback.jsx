import { PackageSearch, RotateCcw } from 'lucide-react'

export default function Feedback({ title, message, onRetry, action = 'Try again' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center" role="status">
      <PackageSearch className="mx-auto mb-4 text-slate-400" size={36} />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{message}</p>
      {onRetry && (
        <button className="btn mt-5" onClick={onRetry}>
          <RotateCcw size={15} />
          {action}
        </button>
      )}
    </div>
  )
}

export function ProductSkeletons() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className="motion-safe:animate-pulse rounded-xl border border-slate-200 bg-white p-3"
        >
          <div className="aspect-square rounded-lg bg-slate-100" />
          <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
          <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
          <div className="mb-3 mt-5 h-6 w-1/3 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}
