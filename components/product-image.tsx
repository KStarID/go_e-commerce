import Image from "next/image"

interface Props {
  src?: string | null
  alt: string
  className?: string
  width?: number
  height?: number
  fallback?: string
}

export default function ProductImage({ src, alt, className = "", width = 400, height = 400, fallback = "👟" }: Props) {
  if (src && src.startsWith("http")) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
        <span className="text-3xl">{fallback}</span>
      </div>
    </div>
  )
}
