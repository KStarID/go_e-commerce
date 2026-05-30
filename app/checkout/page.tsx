"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { supabase } from "@/lib/supabase"
import CouponBox from "@/components/coupon-box"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState("")
  const finalTotal = Math.max(totalPrice - discount, 0)
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "", postalCode: "", notes: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push("/login"); return }
    if (items.length === 0) { setError("Keranjang kosong"); return }
    setLoading(true); setError("")

    try {
      const { data: order, error: orderError } = await supabase.from("orders").insert({
        user_id: user.id, total_amount: finalTotal, status: "pending",
        shipping_address: `${form.address}, ${form.city}, ${form.postalCode}`,
        customer_name: form.fullName, customer_phone: form.phone, notes: form.notes,
        coupon_code: couponCode || null,
        discount_amount: discount,
      }).select().single()

      if (orderError || !order) throw new Error(orderError?.message || "Gagal membuat pesanan")

      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map(item => ({ order_id: order.id, product_id: item.id, quantity: item.quantity, price: item.price }))
      )
      if (itemsError) throw new Error(itemsError.message)

      clearCart()
      router.push(`/order-success?id=${order.id}`)
    } catch {
      setError("Gagal membuat pesanan. Silakan coba lagi.")
      setLoading(false)
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white"><div className="container mx-auto px-4 py-3"><Link href="/" className="text-xl font-bold">ShoesStore</Link></div></div>
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Silakan login terlebih dahulu</h2>
        <Link href="/login"><Button className="rounded-xl">Login</Button></Link>
      </div>
    </div>
  )

  if (items.length === 0) return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white"><div className="container mx-auto px-4 py-3"><Link href="/" className="text-xl font-bold">ShoesStore</Link></div></div>
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-slate-300 mb-6" />
        <h2 className="text-2xl font-bold mb-4">Keranjang kosong</h2>
        <Link href="/"><Button className="rounded-xl">Mulai Belanja</Button></Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3"><Link href="/" className="text-xl font-bold">ShoesStore</Link></div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link href="/cart"><Button variant="ghost" className="mb-6 text-slate-600"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali</Button></Link>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8">Checkout</motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Informasi Pengiriman</h2>
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap *</label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alamat Lengkap *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} required rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kota *</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kode Pos *</label>
                    <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Catatan (Opsional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    placeholder="Contoh: Warna, ukuran, atau instruksi khusus" />
                </div>
                <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
                  {loading ? "Memproses..." : "Buat Pesanan"}
                </Button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-6">Ringkasan Pesanan</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-slate-400">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
              <CouponBox total={totalPrice} onApply={(coupon, value) => {
                setDiscount(value)
                setCouponCode(coupon?.code || "")
              }} />
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>Rp {totalPrice.toLocaleString("id-ID")}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Diskon {couponCode}</span><span>- Rp {discount.toLocaleString("id-ID")}</span></div>
                )}
                <div className="flex justify-between text-slate-500"><span>Ongkir</span><span className="text-green-600 font-medium">Gratis</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total</span><span>Rp {finalTotal.toLocaleString("id-ID")}</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
