"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface Coupon {
  id: string
  code: string
  discount_type: "percent" | "fixed"
  discount_value: number
  min_amount: number
  active: boolean
}

interface Props {
  total: number
  onApply: (coupon: Coupon | null, discount: number) => void
}

export default function CouponBox({ total, onApply }: Props) {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const applyCoupon = async () => {
    if (!code.trim()) return
    setLoading(true)
    setMessage("")

    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("active", true)
      .single()

    if (error || !data) {
      setMessage("Kupon tidak valid")
      onApply(null, 0)
      setLoading(false)
      return
    }

    if (total < Number(data.min_amount || 0)) {
      setMessage(`Minimal belanja Rp ${Number(data.min_amount).toLocaleString("id-ID")}`)
      onApply(null, 0)
      setLoading(false)
      return
    }

    const discount = data.discount_type === "percent"
      ? Math.floor(total * (Number(data.discount_value) / 100))
      : Number(data.discount_value)

    onApply(data, Math.min(discount, total))
    setMessage("Kupon berhasil digunakan")
    setLoading(false)
  }

  return (
    <div className="border-t pt-4 mt-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">Kode Kupon</label>
      <div className="flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="PROMO10"
          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
        <Button type="button" variant="outline" size="sm" onClick={applyCoupon} disabled={loading}>
          Pakai
        </Button>
      </div>
      {message && <p className={`text-xs mt-2 ${message.includes("berhasil") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
    </div>
  )
}
