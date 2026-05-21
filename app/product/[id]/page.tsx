"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCart, ArrowLeft, Plus, Minus, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock: number
  category: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, totalItems } = useCart()
  const { user, signOut } = useAuth()

  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p: Product) => p.id === params.id)
        setProduct(foundProduct || null)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching product:", err)
        setLoading(false)
      })
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      router.push("/cart")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <h1 className="text-2xl font-bold">ShoesStore</h1>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
          <Link href="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">ShoesStore</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center">
              <span className="text-slate-400 text-lg">Product Image</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
                <div className="text-sm text-slate-600">
                  Stok tersedia: {product.stock} unit
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Jumlah
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-2xl font-semibold w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </Button>

                <div className="text-sm text-slate-500 text-center">
                  Total: Rp {(product.price * quantity).toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="font-semibold mb-3">Informasi Produk</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Garansi resmi</li>
                <li>✓ Gratis ongkir untuk pembelian di atas Rp 500.000</li>
                <li>✓ Bisa return dalam 7 hari</li>
                <li>✓ Original 100%</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
