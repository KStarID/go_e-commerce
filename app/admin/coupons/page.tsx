"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Plus, Trash2, Ticket } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Coupon {
  id: string
  code: string
  discount_type: "percent" | "fixed"
  discount_value: number
  min_amount: number
  active: boolean
}

export default function AdminCouponsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [form, setForm] = useState({ code: "", discount_type: "percent", discount_value: "10", min_amount: "0" })

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("profiles").select("is_admin").eq("id", user.id).single()
      .then(({ data }) => {
        if (!data?.is_admin) { router.push("/"); return }
        setIsAdmin(true)
        loadCoupons()
      })
  }, [user, router])

  const loadCoupons = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false })
    if (data) setCoupons(data)
  }

  const addCoupon = async () => {
    if (!form.code) return
    await supabase.from("coupons").insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_amount: Number(form.min_amount),
      active: true,
    })
    setForm({ code: "", discount_type: "percent", discount_value: "10", min_amount: "0" })
    loadCoupons()
  }

  const toggleActive = async (coupon: Coupon) => {
    await supabase.from("coupons").update({ active: !coupon.active }).eq("id", coupon.id)
    loadCoupons()
  }

  const deleteCoupon = async (id: string) => {
    await supabase.from("coupons").delete().eq("id", id)
    loadCoupons()
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
          <Link href="/"><Button variant="outline" size="sm" className="text-white border-slate-600">Lihat Toko</Button></Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Kupon Diskon</h1>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-semibold mb-4">Tambah Kupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-xs text-slate-500">Kode</label>
              <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                placeholder="PROMO10" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Tipe</label>
              <select value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="percent">Persen</option>
                <option value="fixed">Nominal</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Nilai</label>
              <input type="number" value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Min Belanja</label>
              <input type="number" value={form.min_amount} onChange={e => setForm({...form, min_amount: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <Button onClick={addCoupon} className="rounded-xl"><Plus className="w-4 h-4 mr-1" /> Tambah</Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Kode</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Diskon</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600">Min Belanja</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Ticket className="w-12 h-12 mx-auto mb-3 text-slate-300" />Belum ada kupon</td></tr>
              ) : coupons.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold">{c.code}</td>
                  <td className="p-4">{c.discount_type === "percent" ? `${c.discount_value}%` : `Rp ${c.discount_value.toLocaleString("id-ID")}`}</td>
                  <td className="p-4 text-right">Rp {c.min_amount.toLocaleString("id-ID")}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleActive(c)} className={`px-3 py-1 rounded-full text-xs font-medium ${c.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {c.active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200" onClick={() => deleteCoupon(c.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
