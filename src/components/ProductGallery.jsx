import ProductImage from './ProductImage'

export default function ProductGallery({ product }) {
  const images = product.images?.length ? product.images : [product.thumbnail]
  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-[#f2f4f5] p-6 sm:p-10">
        <ProductImage
          src={images[0]}
          alt={product.title}
          className="aspect-square w-full object-contain mix-blend-multiply"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              aria-label={`View image ${index + 1}`}
              className="size-20 rounded-lg border border-slate-200 bg-white p-2"
            >
              <ProductImage src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
