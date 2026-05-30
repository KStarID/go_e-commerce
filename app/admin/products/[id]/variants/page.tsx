"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

interface Variant {
  id: string
  name: string
  variant_type: string
  stock: number
}

export default function ProductVariants() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isAdmin, setIsAdmin] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([])
  const [productName, setProductName] = useState("")
  const [newVariant, setNewVariant] = useState({ name: "", variant_type: "size", stock: "10" })

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("profiles").select("is_admin").eq("id", user.id).single()
      .then(({ data }) => {
        if (!data?.is_admin) { router.push("/"); return }
        setIsAdmin(true)
        loadVariants()
      })
  }, [user, router])

  const loadVariants = async () => {
    const { data: product } = await supabase.from("products").select("name").eq("id", params.id).single()
    if (product) setProductName(product.name)

    const { data } = await supabase.from("product_variants").select("*").eq("product_id", params.id)
    if (data) setVariants(data)
  }

  const addVariant = async () => {
    if (!newVariant.name) return
    await supabase.from("product_variants").insert({
      product_id: params.id, name: newVariant.name,
      variant_type: newVariant.variant_type, stock: parseInt(newVariant.stock) || 0,
    })
    setNewVariant({ name: "", variant_type: "size", stock: "10" })
    loadVariants()
  }

  const deleteVariant = async (id: string) => {
    await supabase.from("product_variants").delete().eq("id", id)
    loadVariants()
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="text-white border-slate-600">Kembali</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/admin/products">
          <Button variant="ghost" className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Produk</Button>
        </Link>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2"
        >
          Varian Produk
        </motion.h1>
        <p className="text-slate-500 mb-8">{productName}</p>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-semibold mb-4">Tambah Varian</h2>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Nama (contoh: 42, Merah)</label>
              <input type="text" value={newVariant.name} onChange={e => setNewVariant({...newVariant, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none" />
            </div>
            <div className="w-24">
              <label className="block text-xs text-slate-500 mb-1">Tipe</label>
              <select value={newVariant.variant_type} onChange={e => setNewVariant({...newVariant, variant_type: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none">
                <option value="size">Size</option>
                <option value="color">Warna</option>
              </select>
            </div>
            <div className="w-20">
              <label className="block text-xs text-slate-500 mb-1">Stok</label>
              <input type="number" value={newVariant.stock} onChange={e => setNewVariant({...newVariant, stock: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none" />
            </div>
            <Button onClick={addVariant} size="sm" className="rounded-xl mb-0.5">
              <Plus className="w-4 h-4 mr-1" /> Tambah
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Nama</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Tipe</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600">Stok</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {variants.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Belum ada varian</td></tr>
              ) : variants.map(v => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium">{v.name}</td>
                  <td className="p-4 text-slate-600 capitalize">{v.variant_type}</td>
                  <td className="p-4 text-right">{v.stock}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200"
                      onClick={() => deleteVariant(v.id)}>
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
