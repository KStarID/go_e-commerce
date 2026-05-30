"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import { ShoppingCart, LogOut, User, Package, Search, Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import ProductImage from "@/components/product-image"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string; name: string; description: string; price: number
  image_url: string; category?: string; stock?: number
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, totalItems } = useCart()
  const { user, signOut } = useAuth()
  const { toggleItem, isInWishlist } = useWishlist()
  const categorySlug = params.slug as string
  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)

  useEffect(() => {
    setLoading(true)
    supabase.from("products").select("*")
      .ilike("category", categorySlug)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setProducts(data)
        setLoading(false)
      })
  }, [categorySlug])

  return (
    <div className="min-h-screen">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          <div className="flex items-center gap-2">
            <Link href="/wishlist">
              <Button variant="ghost" className="relative text-white hover:bg-white/10"><Heart className="w-5 h-5" /></Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" className="relative text-white hover:bg-white/10">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{totalItems}</span>}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
            </Link>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              {categoryName}
            </motion.h1>
            <p className="text-slate-400">{products.length} produk tersedia</p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-48 skeleton" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-2/3 rounded skeleton" />
                      <div className="h-4 w-full rounded skeleton" />
                      <div className="h-4 w-1/3 rounded skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">Tidak ada produk</h3>
                <p className="text-slate-500 mb-6">Belum ada produk di kategori ini</p>
                <Link href="/"><Button className="rounded-xl">Lihat Semua Produk</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative">
                        <ProductImage src={product.image_url} alt={product.name} className="h-48 w-full" fallback="👟" />
                        <button onClick={(e) => { e.preventDefault(); toggleItem(product) }}
                          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all">
                          <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
                        </button>
                      </div>
                    </Link>
                    <div className="p-5">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-slate-600 transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">Rp {product.price.toLocaleString("id-ID")}</span>
                        <Button onClick={() => addToCart(product)} className="rounded-xl">+ Keranjang</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
