"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: { name: string }
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  discount_amount?: number
  coupon_code?: string
  status: string
  created_at: string
  customer_name: string
  customer_phone: string
  shipping_address: string
}

export default function InvoicePage() {
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
        const query = supabase.from("orders").select("*").eq("id", params.id)
        const finalQuery = admin ? query : query.eq("user_id", user.id)
        finalQuery.single().then(({ data: orderData, error }) => {
          if (error || !orderData) { router.push("/orders"); return }
          setOrder(orderData)
          supabase.from("order_items").select("*, products(name)").eq("order_id", orderData.id)
            .then(({ data }) => { if (data) setItems(data); setLoading(false) })
        })
      })
  }, [params.id, user, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>
  if (!order) return null

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = Number(order.discount_amount || 0)

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="container mx-auto px-4 max-w-4xl print:max-w-none print:px-0">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link href={`/orders/${order.id}`}>
            <Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali</Button>
          </Link>
          <Button onClick={() => window.print()} className="rounded-xl">
            <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-10 print:shadow-none print:rounded-none">
          <div className="flex items-start justify-between border-b pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-bold">ShoesStore</h1>
              <p className="text-slate-500 mt-1">Invoice pesanan online</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className="font-mono text-slate-500">#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm text-slate-500 mt-1">
                {new Date(order.created_at).toLocaleDateString("id-ID", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Ditagihkan Kepada</h3>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">{order.customer_name}</p>
                <p>{order.customer_phone}</p>
                <p>{order.shipping_address}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Status Pesanan</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium capitalize">
                {order.status}
              </span>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Produk</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-600">Qty</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600">Harga</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-4 font-medium">{item.products?.name || "Product"}</td>
                  <td className="p-4 text-center">{item.quantity}</td>
                  <td className="p-4 text-right">Rp {item.price.toLocaleString("id-ID")}</td>
                  <td className="p-4 text-right font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>Rp {subtotal.toLocaleString("id-ID")}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Diskon {order.coupon_code}</span><span>- Rp {discount.toLocaleString("id-ID")}</span></div>
              )}
              <div className="flex justify-between"><span className="text-slate-500">Ongkir</span><span>Gratis</span></div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span><span>Rp {order.total_amount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <div className="border-t mt-10 pt-6 text-center text-sm text-slate-500">
            Terima kasih telah berbelanja di ShoesStore.
          </div>
        </div>
      </div>
    </div>
  )
}
