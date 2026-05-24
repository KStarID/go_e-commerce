"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function EditProduct() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", category: "", image_url: "",
  })

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("profiles").select("is_admin").eq("id", user.id).single()
      .then(({ data }) => {
        if (!data?.is_admin) { router.push("/"); return }
        setIsAdmin(true)
        supabase.from("products").select("*").eq("id", params.id).single()
          .then(({ data: product }) => {
            if (product) {
              setForm({
                name: product.name,
                description: product.description || "",
                price: product.price.toString(),
                stock: product.stock.toString(),
                category: product.category || "",
                image_url: product.image_url || "",
              })
            }
            setFetching(false)
          })
      })
  }, [user, router, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("products").update({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      image_url: form.image_url || null,
    }).eq("id", params.id)

    if (!error) {
      router.push("/admin/products")
    } else {
      alert("Error: " + error.message)
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (!isAdmin || fetching) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/admin/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </Link>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Edit Produk
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Produk *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Harga *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stok *</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kategori *</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} required
                placeholder="Contoh: Running, Casual, Sport"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL Gambar</label>
              <input type="url" name="image_url" value={form.image_url} onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Menyimpan..." : "Update Produk"}
              </Button>
              <Link href="/admin/products" className="flex-1">
                <Button type="button" variant="outline" className="w-full">Batal</Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
