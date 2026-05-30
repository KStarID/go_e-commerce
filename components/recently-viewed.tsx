"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { getRecentlyViewed } from "@/lib/recently-viewed"
import Link from "next/link"
import ProductImage from "@/components/product-image"
import { Clock } from "lucide-react"

interface Product {
  id: string; name: string; description: string; price: number; image_url: string
}

export default function RecentlyViewedSection() {
  const [items, setItems] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    setItems(getRecentlyViewed())
  }, [])

  if (items.length === 0) return null

  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-slate-500" />
        <h3 className="text-xl font-bold text-slate-900">Baru Dilihat</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <Link href={`/product/${product.id}`}>
              <ProductImage src={product.image_url} alt={product.name} className="h-36 w-full" fallback="👟" />
            </Link>
            <div className="p-4">
              <Link href={`/product/${product.id}`}>
                <h4 className="font-semibold text-sm mb-1 group-hover:text-slate-600 transition-colors truncate">{product.name}</h4>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Rp {product.price.toLocaleString("id-ID")}</span>
                <Button size="sm" onClick={() => addToCart(product)} className="rounded-xl text-xs h-8">+</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
