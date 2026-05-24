"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ShoppingCart, User, LogOut, Package, ArrowLeft, MapPin, Phone, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

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

const statusLabels: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
}

const statusSteps = [
  { key: "pending", label: "Pesanan Dibuat" },
  { key: "processing", label: "Diproses" },
  { key: "shipped", label: "Dikirim" },
  { key: "delivered", label: "Selesai" },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data: profile }) => {
        const admin = !!profile?.is_admin
        setIsAdmin(admin)

        const query = supabase.from("orders").select("*").eq("id", params.id)
        const finalQuery = admin ? query : query.eq("user_id", user.id)
        finalQuery.single().then(({ data: orderData, error }) => {
          if (error || !orderData) {
            router.push(admin ? "/admin/orders" : "/orders")
            return
          }
          setOrder(orderData)

          supabase
            .from("order_items")
            .select("*, products(name, image_url)")
            .eq("order_id", orderData.id)
            .then(({ data: itemsData }) => {
              if (itemsData) {
                setItems(itemsData)
              }
              setLoading(false)
            })
        })
      })
  }, [params.id, user, router])

  if (!user || !order) return null

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">ShoesStore</h1>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link href={isAdmin ? "/admin/orders" : "/orders"}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Pesanan
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Pesanan #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {statusLabels[order.status]}
              </span>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= currentStepIndex
                        ? "bg-slate-900 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      {i + 1}
                    </div>
                    <div className={`text-xs mt-2 text-center ${
                      i <= currentStepIndex ? "text-slate-900 font-medium" : "text-slate-400"
                    }`}>
                      {step.label}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`h-0.5 w-full mt-4 -ml-4 ${
                        i < currentStepIndex ? "bg-slate-900" : "bg-slate-200"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Produk</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{item.products?.name || "Product"}</div>
                        <div className="text-sm text-slate-600">
                          {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="text-right font-semibold">
                        Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Info Pengiriman</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <UserIcon className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>{order.customer_phone}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>{order.shipping_address}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Ringkasan</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span>Rp {order.total_amount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ongkir</span>
                    <span>Rp 0</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>Rp {order.total_amount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
