"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

interface Variant {
  id: string
  name: string
  variant_type: string
  stock: number
}

interface Props {
  productId: string
  onSelect: (variant: Variant | null) => void
}

export default function VariantSelector({ productId, onSelect }: Props) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [selected, setSelected] = useState<string>("")
  const types = [...new Set(variants.map(v => v.variant_type))]

  useEffect(() => {
    supabase.from("product_variants").select("*").eq("product_id", productId)
      .then(({ data }) => { if (data) setVariants(data) })
  }, [productId])

  const handleSelect = (variant: Variant) => {
    const next = selected === variant.id ? "" : variant.id
    setSelected(next)
    onSelect(next ? variant : null)
  }

  if (variants.length === 0) return null

  return (
    <div className="space-y-4">
      {types.map(type => (
        <div key={type}>
          <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">{type}</label>
          <div className="flex flex-wrap gap-2">
            {variants.filter(v => v.variant_type === type).map(v => (
              <motion.button
                key={v.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(v)}
                disabled={v.stock === 0}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  selected === v.id
                    ? "bg-slate-900 text-white border-slate-900"
                    : v.stock === 0
                    ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed line-through"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                {v.name}
                {v.stock === 0 && " (habis)"}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
