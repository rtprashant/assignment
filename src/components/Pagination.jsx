import { Fragment } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const start = Math.max(1, Math.min(page - 1, totalPages - 2))
  const pages = Array.from({ length: Math.min(3, totalPages) }, (_, index) => start + index)
  if (pages.at(-1) < totalPages) pages.push(totalPages)
  return (
    <nav
      aria-label="Product pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5 border-t border-slate-200 pt-6"
    >
      <button
        type="button"
        className="btn"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>
      {pages.map((number, index) => (
        <Fragment key={number}>
          {index > 0 && number - pages[index - 1] > 1 && (
            <span className="px-2 text-slate-400" aria-hidden="true">
              …
            </span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(number)}
            aria-label={`Page ${number}`}
            aria-current={number === page ? 'page' : undefined}
            className={`btn min-w-10 ${number === page ? '!border-slate-900 !bg-slate-900 !text-white' : ''}`}
          >
            {number}
          </button>
        </Fragment>
      ))}
      <button
        type="button"
        className="btn"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight size={16} />
      </button>
    </nav>
  )
}
