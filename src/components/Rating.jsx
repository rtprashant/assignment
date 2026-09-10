import { Star } from 'lucide-react'

export default function Rating({ value }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-slate-500"
      aria-label={`${value} out of 5 stars`}
    >
      <span className="flex text-amber-500" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((star) => {
          const fill = Math.max(0, Math.min(1, value - star)) * 100
          return (
            <span key={star} className="relative block size-[13px]">
              <Star size={13} className="text-slate-300" />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <Star size={13} fill="currentColor" />
              </span>
            </span>
          )
        })}
      </span>
      <span>{value.toFixed(1)}</span>
    </span>
  )
}
