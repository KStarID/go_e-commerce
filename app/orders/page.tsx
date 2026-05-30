"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ShoppingCart, User, LogOut, Package, Clock, ChevronRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
}

const statusStyles: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Diproses", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Dikirim", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Selesai", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
}

export default function OrdersPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOrders(data); setLoading(false) })
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button variant="ghost" className="relative text-white hover:bg-white/10">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>
            <span className="text-sm text-slate-300 hidden sm:inline">{user.email?.split("@")[0]}</span>
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-slate-300 hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Pesanan Saya
        </motion.h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6"><div className="h-16 skeleton rounded-xl" /></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <Package className="w-24 h-24 mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Belum Ada Pesanan</h2>
            <p className="text-slate-500 mb-8">Anda belum memiliki pesanan apapun</p>
            <Link href="/"><Button size="lg" className="rounded-xl">Mulai Belanja</Button></Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/orders/${order.id}`}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex items-center justify-between group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status]?.color || "bg-slate-100"}`}>
                          {statusStyles[order.status]?.label || order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold">Rp {order.total_amount.toLocaleString("id-ID")}</div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
