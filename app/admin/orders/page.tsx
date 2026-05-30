"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ShoppingBag, Eye, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { exportToCSV } from "@/lib/export"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  customer_name: string
  customer_phone: string
}

const statusLabels: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function AdminOrders() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("profiles").select("is_admin").eq("id", user.id).single()
      .then(({ data }) => {
        if (!data?.is_admin) { router.push("/"); return }
        setIsAdmin(true)
        loadOrders()
      })
  }, [user, router])

  const loadOrders = () => {
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data)
        setLoading(false)
      })
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id)
    loadOrders()
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)

  if (!isAdmin || loading) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-white border-slate-600">
              Lihat Toko
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Pesanan</h1>
            <p className="text-slate-600">
              Total {orders.length} pesanan · Rp {totalRevenue.toLocaleString("id-ID")}
            </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => exportToCSV(orders, "orders")}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </div>
        </motion.div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Belum Ada Pesanan</h2>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-slate-600">Order</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-600">Customer</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-600">Tanggal</th>
                  <th className="text-right p-4 font-semibold text-sm text-slate-600">Total</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-600">Status</th>
                  <th className="text-right p-4 font-semibold text-sm text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono text-sm">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{o.customer_name}</div>
                      <div className="text-sm text-slate-500">{o.customer_phone}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(o.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4 text-right font-medium">
                      Rp {o.total_amount.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[o.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/orders/${o.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
