"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import StarRating from "./star-rating"
import Link from "next/link"

interface Props {
  productId: string
  onSubmitted: () => void
}

export default function ReviewForm({ productId, onSubmitted }: Props) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || rating === 0) return
    setSaving(true)

    await supabase.from("reviews").upsert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    }, { onConflict: "product_id,user_id" })

    setSaving(false)
    setRating(0)
    setComment("")
    onSubmitted()
  }

  if (!user) {
    return (
      <div className="bg-slate-50 rounded-2xl p-6 text-center">
        <p className="text-slate-500 mb-3">Login untuk memberikan review</p>
        <Link href="/login"><Button variant="outline" size="sm" className="rounded-xl">Login</Button></Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-6">
      <h4 className="font-semibold mb-4">Beri Review</h4>
      <div className="mb-4">
        <StarRating rating={rating} onChange={setRating} size="lg" interactive />
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)}
        placeholder="Bagaimana pendapat Anda tentang produk ini?"
        rows={3} maxLength={500}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none mb-3" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{comment.length}/500</span>
        <Button type="submit" size="sm" disabled={saving || rating === 0} className="rounded-xl">
          {saving ? "Menyimpan..." : "Kirim Review"}
        </Button>
      </div>
    </form>
  )
}
