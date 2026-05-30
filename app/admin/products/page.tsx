"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2, Plus, Package, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { exportToCSV } from "@/lib/export"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  created_at: string
}

export default function AdminProducts() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    supabase.from("profiles").select("is_admin").eq("id", user.id).single()
      .then(({ data }) => {
        if (!data?.is_admin) { router.push("/"); return }
        setIsAdmin(true)
        loadProducts()
      })
  }, [user, router])

  const loadProducts = () => {
    supabase.from("products").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setProducts(data)
        setLoading(false)
      })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return
    await supabase.from("products").delete().eq("id", id)
    loadProducts()
  }

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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Produk
          </motion.h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => exportToCSV(products, "products")}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Tambah Produk
              </Button>
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Belum Ada Produk</h2>
            <Link href="/admin/products/new">
              <Button>Tambah Produk Pertama</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-slate-600">Nama</th>
                  <th className="text-left p-4 font-semibold text-sm text-slate-600">Kategori</th>
                  <th className="text-right p-4 font-semibold text-sm text-slate-600">Harga</th>
                  <th className="text-right p-4 font-semibold text-sm text-slate-600">Stok</th>
                  <th className="text-right p-4 font-semibold text-sm text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-slate-600">{p.category}</td>
                    <td className="p-4 text-right">Rp {p.price.toLocaleString("id-ID")}</td>
                    <td className="p-4 text-right">{p.stock}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p.id}/variants`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Varian
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${p.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
