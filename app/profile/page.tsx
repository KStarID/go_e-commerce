"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { User, ShoppingCart, Heart, Package, LogOut, Save, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" })

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("profiles").select("*").eq("id", user.id).single()
      .then(({ data }) => {
        if (data) setForm({ full_name: data.full_name || "", phone: data.phone || "", address: data.address || "" })
        setLoading(false)
      })
  }, [user, router])

  const handleSave = async () => {
    setSaving(true); setMessage("")
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, phone: form.phone, address: form.address,
    }).eq("id", user!.id)
    setMessage(error ? "Gagal menyimpan" : "Profil berhasil diperbarui!")
    setSaving(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  if (!user || loading) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-slate-300 hover:text-white hover:bg-white/10">
            <LogOut className="w-4 h-4 mr-1" /> Keluar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{form.full_name || "Pengguna"}</h1>
                <p className="text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Package, label: "Pesanan", href: "/orders" },
                { icon: Heart, label: "Wishlist", href: "/wishlist" },
                { icon: ShoppingCart, label: "Keranjang", href: "/cart" },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <div className="bg-white rounded-2xl shadow-sm p-5 text-center hover:shadow-md transition-all">
                    <item.icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    <div className="text-sm font-medium">{item.label}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6">Edit Profil</h2>

              {message && (
                <div className={`p-3 rounded-xl mb-6 text-sm ${message.includes("berhasil") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {message}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alamat</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                </div>
                <Button onClick={handleSave} className="rounded-xl" disabled={saving}>
                  {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
