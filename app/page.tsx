"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCart, LogOut, User, Package } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, totalItems } = useCart()
  const { user, signOut } = useAuth()

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tight"
          >
            <Link href="/">ShoesStore</Link>
          </motion.h1>
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button variant="ghost" className="relative text-white hover:text-white hover:bg-white/10">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 hidden sm:flex">
                    <Package className="w-4 h-4 mr-1" />
                    Pesanan
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-slate-300 hover:text-white hover:bg-white/10">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-white/10">
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">
                New Collection 2026
              </p>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Koleksi Sepatu<br />Terbaik
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Temukan sepatu impian Anda dengan kualitas terbaik dan harga terjangkau
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 pb-16">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Semua Produk</h3>
              <span className="text-sm text-slate-500">{products.length} produk tersedia</span>
            </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-2/3 rounded skeleton" />
                  <div className="h-4 w-full rounded skeleton" />
                  <div className="h-4 w-1/3 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                    <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">👟</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-slate-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <Button onClick={() => addToCart(product)} className="rounded-xl">
                      + Keranjang
                    </Button>
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
