import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'

export default function App() {
  return (
    <BrowserRouter>
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <ShoppingBag className="text-amber-400" />
            everyday<span className="text-amber-400">.</span>
          </Link>
          <span className="text-xs text-slate-300 sm:text-sm">Good finds. Everyday essentials.</span>
        </div>
      </header>
      <main className="mx-auto min-h-[calc(100vh-155px)] max-w-7xl px-5 py-8 sm:px-8">
        <Routes>
          <Route path="/" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="*"
            element={
              <div className="py-20 text-center">
                <h1 className="text-2xl font-bold">Page not found</h1>
                <Link className="btn mt-5" to="/">
                  Browse products
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="flex w-full items-center justify-center border-t border-slate-200 px-5 py-6">
        <p className="m-0 text-center text-xs leading-5 text-slate-500">
          Everyday · A little something for every day.
        </p>
      </footer>
    </BrowserRouter>
  )
}
