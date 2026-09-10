import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ListingHeader({ search = '', onSearch }) {
  const [value, setValue] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => onSearch?.(value), 400)
    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
          The everyday collection
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find your next favorite.</h1>
        <p className="mt-2 text-sm text-slate-500">Explore the essentials, discover something new.</p>
      </div>
      <label className="relative w-full sm:max-w-80">
        <span className="sr-only">Search products</span>
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input
          type="search"
          className="field !pl-10"
          placeholder="Search products…"
          name="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
    </div>
  )
}
