"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, User, LogOut, Package } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import ProductImage from "@/components/product-image"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart()
  const { user } = useAuth()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag className="w-24 h-24 mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Keranjang Kosong</h2>
            <p className="text-slate-500 mb-8">Belum ada produk di keranjang Anda</p>
            <Link href="/"><Button size="lg" className="rounded-xl">Mulai Belanja</Button></Link>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">{totalItems} item</span>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden sm:flex">
                    <Package className="w-4 h-4 mr-1" /> Pesanan
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-slate-300"><User className="w-4 h-4" /></Button>
              </div>
            ) : (
              <Link href="/login"><Button variant="outline" size="sm" className="text-white border-slate-600">Masuk</Button></Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Keranjang Belanja
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm p-5"
              >
                <div className="flex gap-5">
                  <ProductImage src={item.image_url} alt={item.name}
                    className="w-24 h-24 rounded-xl flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-slate-500 text-sm">{item.description}</p>
                        {item.variantName && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                            {item.variantName}
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-lg">
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-lg">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</div>
                        <div className="text-xs text-slate-400">Rp {item.price.toLocaleString("id-ID")} / item</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 sticky top-20"
            >
              <h3 className="text-lg font-bold mb-6">Ringkasan Belanja</h3>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} item)</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ongkir</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full rounded-xl" size="lg">Checkout</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full mt-3 rounded-xl">Lanjut Belanja</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
