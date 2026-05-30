"use client"

import { Suspense, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import confetti from "canvas-confetti"

function OrderContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="text-xl font-bold">ShoesStore</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold mb-4">Pesanan Berhasil!</h1>
          <p className="text-slate-500 mb-8">Terima kasih telah berbelanja di ShoesStore</p>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-left">
            <div className="text-center mb-6">
              <div className="text-sm text-slate-500 mb-1">Nomor Pesanan</div>
              <div className="text-2xl font-bold font-mono">#{orderId?.toUpperCase()}</div>
            </div>

            <div className="border-t pt-6 space-y-5">
              {[
                { num: 1, label: "Pesanan Dikonfirmasi", desc: "Kami telah menerima pesanan Anda", done: true },
                { num: 2, label: "Sedang Diproses", desc: "Pesanan Anda sedang disiapkan", done: false },
                { num: 3, label: "Dalam Pengiriman", desc: "Pesanan akan segera dikirim", done: false },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-medium ${step.done ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                    {step.done ? "✓" : step.num}
                  </div>
                  <div>
                    <div className="font-semibold">{step.label}</div>
                    <div className="text-sm text-slate-500">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Informasi Penting</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Konfirmasi pesanan telah dikirim ke email Anda</li>
              <li>• Estimasi pengiriman 2-3 hari kerja</li>
              <li>• Anda dapat melacak pesanan melalui halaman pesanan</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/"><Button size="lg" variant="outline" className="rounded-xl">Kembali ke Beranda</Button></Link>
            {orderId && <Link href={`/orders/${orderId}/invoice`}><Button size="lg" variant="outline" className="rounded-xl">Lihat Invoice</Button></Link>}
            <Link href="/"><Button size="lg" className="rounded-xl">Lanjut Belanja</Button></Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  )
}
