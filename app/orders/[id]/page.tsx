"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Package, ArrowLeft, MapPin, Phone, User, ShoppingCart, LogOut, Shield, Truck, RotateCcw, Check, FileText } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import ProductImage from "@/components/product-image"

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  products: { name: string; image_url: string }
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  customer_name: string
  customer_phone: string
  shipping_address: string
  notes: string
}

const statusSteps = [
  { key: "pending", label: "Pesanan Dibuat" },
  { key: "processing", label: "Diproses" },
  { key: "shipped", label: "Dikirim" },
  { key: "delivered", label: "Selesai" },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800", delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("profiles").select("is_admin").eq("id", user.id).single()
      .then(({ data: profile }) => {
        const admin = !!profile?.is_admin
        setIsAdmin(admin)
        const q = supabase.from("orders").select("*").eq("id", params.id)
        ;(admin ? q : q.eq("user_id", user.id)).single()
          .then(({ data: orderData, error }) => {
            if (error || !orderData) { router.push(admin ? "/admin/orders" : "/orders"); return }
            setOrder(orderData)
            supabase.from("order_items").select("*, products(name, image_url)").eq("order_id", orderData.id)
              .then(({ data }) => { if (data) setItems(data); setLoading(false) })
          })
      })
  }, [params.id, user, router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 h-14" />
      <div className="container mx-auto px-4 py-8"><div className="h-64 skeleton rounded-2xl" /></div>
    </div>
  )

  if (!user || !order) return null

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button variant="ghost" className="text-white hover:bg-white/10"><ShoppingCart className="w-5 h-5" /></Button>
            </Link>
            {!isAdmin && (
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={isAdmin ? "/admin/orders" : "/orders"}>
            <Button variant="ghost" className="text-slate-600"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali</Button>
          </Link>
          <Link href={`/orders/${order.id}/invoice`}>
            <Button variant="outline" className="rounded-xl"><FileText className="w-4 h-4 mr-2" /> Invoice</Button>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Pesanan #{order.id.slice(0, 8).toUpperCase()}</h1>
                <p className="text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-slate-100"}`}>
                {order.status === "pending" ? "Menunggu" :
                 order.status === "processing" ? "Diproses" :
                 order.status === "shipped" ? "Dikirim" :
                 order.status === "delivered" ? "Selesai" : order.status}
              </span>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= currentStepIndex ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      {i <= currentStepIndex ? "✓" : i + 1}
                    </div>
                    <div className={`text-xs mt-2 text-center font-medium ${i <= currentStepIndex ? "text-slate-900" : "text-slate-400"}`}>
                      {step.label}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`h-1 w-full mt-4 -ml-5 rounded-full ${i < currentStepIndex ? "bg-slate-900" : "bg-slate-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Produk</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                      <ProductImage src={item.products?.image_url} alt={item.products?.name || "Product"}
                        className="w-16 h-16 rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{item.products?.name || "Product"}</div>
                        <div className="text-sm text-slate-500">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</div>
                      </div>
                      <div className="text-right font-semibold flex-shrink-0">Rp {(item.quantity * item.price).toLocaleString("id-ID")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Info Pengiriman</h2>
                <div className="space-y-4 text-sm">
                  {[
                    { icon: User, text: order.customer_name },
                    { icon: Phone, text: order.customer_phone },
                    { icon: MapPin, text: order.shipping_address },
                  ].map((info, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <info.icon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="text-slate-600">{info.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Ringkasan</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span><span>Rp {order.total_amount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Ongkir</span><span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-base">
                    <span>Total</span><span>Rp {order.total_amount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Layanan</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: Shield, label: "Garansi resmi" },
                    { icon: Truck, label: "Gratis ongkir" },
                    { icon: RotateCcw, label: "Return 7 hari" },
                    { icon: Check, label: "Original 100%" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-500">
                      <s.icon className="w-4 h-4" /> {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
