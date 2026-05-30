"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (form.password !== form.confirmPassword) { setError("Password tidak cocok"); return }
    if (form.password.length < 6) { setError("Password minimal 6 karakter"); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.fullName)
    if (error) { setError(error.message); setLoading(false) }
    else router.push("/")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-transparent pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <Link href="/"><h1 className="text-3xl font-bold mb-2">ShoesStore</h1></Link>
            <p className="text-slate-500">Buat akun baru</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                placeholder="nama@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-slate-900 font-semibold hover:underline">Masuk</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
