"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import ProductImage from "@/components/product-image"

export default function WishlistPage() {
  const { items, removeItem, toggleItem } = useWishlist()
  const { addToCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-3"><Link href="/" className="text-xl font-bold">ShoesStore</Link></div>
        </header>
        <main className="container mx-auto px-4 py-20 text-center">
          <Heart className="w-24 h-24 mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Wishlist Kosong</h2>
          <p className="text-slate-500 mb-8">Belum ada produk favorit</p>
          <Link href="/"><Button size="lg" className="rounded-xl">Mulai Belanja</Button></Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          <Link href="/cart">
            <Button variant="ghost" className="text-white hover:bg-white/10"><ShoppingCart className="w-5 h-5" /></Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Wishlist ({items.length})
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative">
                  <ProductImage src={product.image_url} alt={product.name}
                    className="h-48 w-full" />
                  <button onClick={(e) => { e.preventDefault(); toggleItem(product) }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                </div>
              </Link>
              <div className="p-5">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold mb-1 group-hover:text-slate-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">Rp {product.price.toLocaleString("id-ID")}</span>
                  <Button size="sm" onClick={() => { addToCart(product); removeItem(product.id) }} className="rounded-xl">
                    + Keranjang
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
