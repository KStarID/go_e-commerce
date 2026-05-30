"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCart, ArrowLeft, Plus, Minus, User, LogOut, Package, Shield, Truck, RotateCcw, Check, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import ProductImage from "@/components/product-image"
import ReviewForm from "@/components/review-form"
import StarRating from "@/components/star-rating"
import VariantSelector from "@/components/variant-selector"
import { supabase } from "@/lib/supabase"
import { addRecentlyViewed } from "@/lib/recently-viewed"

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
}

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
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedVariant, setSelectedVariant] = useState<{id:string; name:string} | null>(null)
  const { addToCart, totalItems } = useCart()
  const { user, signOut } = useAuth()

  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p: Product) => p.id === params.id)
        setProduct(foundProduct || null)
        if (foundProduct) addRecentlyViewed(foundProduct)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const loadReviews = () => {
    supabase.from("reviews").select("*").eq("product_id", params.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setReviews(data) })
  }

  useEffect(() => { if (!loading && product) loadReviews() }, [loading, product?.id])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++)
        addToCart(product, selectedVariant?.id, selectedVariant?.name)
      router.push("/cart")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-900 h-14" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl skeleton" />
            <div className="space-y-4">
              <div className="h-6 w-20 rounded skeleton" />
              <div className="h-10 w-3/4 rounded skeleton" />
              <div className="h-20 w-full rounded skeleton" />
              <div className="h-12 w-1/3 rounded skeleton" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-3">
            <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-20 h-20 mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
          <Link href="/"><Button>Kembali ke Beranda</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          <div className="flex items-center gap-3">
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
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden sm:flex">
                    <Package className="w-4 h-4 mr-1" /> Pesanan
                  </Button>
                </Link>
                <span className="text-sm text-slate-300 hidden sm:inline">{user.email?.split("@")[0]}</span>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-slate-300 hover:text-white hover:bg-white/10">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login"><Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-white/10">Masuk</Button></Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-600">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <ProductImage src={product.image_url} alt={product.name}
              className="aspect-square rounded-2xl" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full font-medium">
                  {product.category}
                </span>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
                    Sisa {product.stock}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

              <div className="mb-6">
                <div className="text-4xl font-bold text-slate-900 mb-1">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <VariantSelector productId={product.id}
                  onSelect={(v) => setSelectedVariant(v ? { id: v.id, name: v.name } : null)} />
              </div>

              <div className="border-t pt-6 mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Jumlah</label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="lg" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-xl">
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-2xl font-semibold w-16 text-center">{quantity}</span>
                  <Button variant="outline" size="lg" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="rounded-xl">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Button size="lg" className="w-full rounded-xl text-base" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
              </Button>
              <div className="text-sm text-slate-500 text-center mt-3">
                Total: Rp {(product.price * quantity).toLocaleString("id-ID")}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Informasi Produk</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Shield className="w-5 h-5 text-slate-400" /> Garansi resmi
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Truck className="w-5 h-5 text-slate-400" /> Gratis ongkir min Rp 500rb
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <RotateCcw className="w-5 h-5 text-slate-400" /> Return 7 hari
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-slate-400" /> Original 100%
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6" /> Review ({reviews.length})
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)} size="md" />
                  <span className="text-sm text-slate-500">
                    {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} rata-rata
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <ReviewForm productId={product.id} onSubmitted={loadReviews} />

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Belum ada review untuk produk ini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                        {review.user_id.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                    {review.comment && <p className="text-slate-600 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
