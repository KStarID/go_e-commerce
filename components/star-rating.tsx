import { useState } from "react"

interface Props {
  rating: number
  onChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  interactive?: boolean
}

const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }

export default function StarRating({ rating, onChange, size = "md", interactive = false }: Props) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (interactive ? hover || rating : rating)
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => onChange?.(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-all ${sizes[size]}`}
          >
            <svg viewBox="0 0 24 24" className={`${sizes[size]} ${filled ? "text-yellow-400" : "text-slate-200"}`} fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
