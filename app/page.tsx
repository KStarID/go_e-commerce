"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCart, LogOut, User, Package, Search, Heart } from "lucide-react"
import Link from "next/link"
import { useWishlist } from "@/lib/wishlist-context"
import ProductImage from "@/components/product-image"
import RecentlyViewedSection from "@/components/recently-viewed"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category?: string
  stock?: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const { addToCart, totalItems } = useCart()
  const { user, signOut } = useAuth()
  const { toggleItem, isInWishlist } = useWishlist()

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean))
    return Array.from(cats).sort() as string[]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !selectedCategory || p.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [products, search, selectedCategory])

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
          <div className="flex items-center gap-2">
            <Link href="/wishlist">
              <Button variant="ghost" className="relative text-white hover:bg-white/10">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" className="relative text-white hover:bg-white/10">
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
                <Link href="/profile">
                  <div className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
                  </div>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-slate-300 hover:text-white hover:bg-white/10">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold mb-2">Produk tidak ditemukan</h3>
            <p className="text-slate-500 mb-6">Coba kata kunci atau kategori lain</p>
            <button onClick={() => { setSearch(""); setSelectedCategory("") }}
              className="text-sm text-slate-900 underline font-medium">Reset filter</button>
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
              {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mt-10">
                  {categories.map(cat => (
                    <Link key={cat} href={`/categories/${cat.toLowerCase()}`}>
                      <div className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium transition-all border border-white/10">
                        {cat}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 pb-16">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Semua Produk</h3>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
              </div>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setSelectedCategory("")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCategory ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  Semua
                </button>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-slate-500">{filteredProducts.length} produk ditemukan</span>
              {search && (
                <button onClick={() => setSearch("")} className="text-sm text-slate-500 hover:text-slate-900 underline">Hapus filter</button>
              )}
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
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative">
                    <ProductImage src={product.image_url} alt={product.name}
                      className="h-48 w-full" fallback="👟" />
                    <button onClick={(e) => { e.preventDefault(); toggleItem(product) }}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all">
                      <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
                    </button>
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

        <RecentlyViewedSection />
      </main>
    </div>
  )
}
