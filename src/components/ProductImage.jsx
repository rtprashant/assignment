import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export default function ProductImage({ src, alt, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  if (!src || failedSrc === src)
    return (
      <div
        className={`flex items-center justify-center text-slate-400 ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={40} />
      </div>
    )
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailedSrc(src)} />
}
