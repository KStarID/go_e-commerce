"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Package, ShoppingBag, Users, DollarSign, ArrowRight, Ticket } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })
  const [checking, setChecking] = useState(true)

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
      .then(({ data, error }) => {
        if (error || !data?.is_admin) {
          router.push("/")
          return
        }
        setIsAdmin(true)

        Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("total_amount"),
        ]).then(([products, orders, revenue]) => {
          const totalRevenue = (revenue.data || []).reduce(
            (sum: number, o: any) => sum + Number(o.total_amount), 0
          )
          setStats({
            products: products.count || 0,
            orders: orders.count || 0,
            revenue: totalRevenue,
          })
          setChecking(false)
        })
      })
  }, [user, router])

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!isAdmin) return null

  const cards = [
    { label: "Total Produk", value: stats.products, icon: Package, href: "/admin/products", color: "bg-blue-500" },
    { label: "Total Pesanan", value: stats.orders, icon: ShoppingBag, href: "/admin/orders", color: "bg-green-500" },
    { label: "Total User", value: "-", icon: Users, href: "#", color: "bg-purple-500" },
    { label: "Pendapatan", value: `Rp ${stats.revenue.toLocaleString("id-ID")}`, icon: DollarSign, href: "/admin/orders", color: "bg-yellow-500" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-white border-slate-600">
                Lihat Toko
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, i) => (
            <Link key={card.label} href={card.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
                <div className="text-2xl font-bold mb-1">{card.value}</div>
                <div className="text-sm text-slate-600">{card.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/admin/products">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-4">Kelola Produk</h2>
              <p className="text-slate-600 mb-4">Tambah, edit, atau hapus produk</p>
              <Button variant="outline">Kelola Produk</Button>
            </motion.div>
          </Link>

          <Link href="/admin/orders">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-4">Kelola Pesanan</h2>
              <p className="text-slate-600 mb-4">Lihat dan update status pesanan</p>
              <Button variant="outline">Kelola Pesanan</Button>
            </motion.div>
          </Link>

          <Link href="/admin/coupons">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-4">Kelola Kupon</h2>
              <p className="text-slate-600 mb-4">Buat dan kelola kode diskon</p>
              <Button variant="outline">Kelola Kupon</Button>
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  )
}
