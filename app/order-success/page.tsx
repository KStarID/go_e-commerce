"use client"

import { Suspense, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import confetti from "canvas-confetti"

function OrderContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <h1 className="text-2xl font-bold">ShoesStore</h1>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4">Pesanan Berhasil!</h1>
          <p className="text-slate-600 text-lg mb-8">
            Terima kasih telah berbelanja di ShoesStore
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="mb-6">
              <div className="text-sm text-slate-600 mb-2">Nomor Pesanan</div>
              <div className="text-2xl font-bold text-slate-900">
                #{orderId?.toUpperCase()}
              </div>
            </div>

            <div className="border-t pt-6 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-semibold">Pesanan Dikonfirmasi</div>
                  <div className="text-sm text-slate-600">
                    Kami telah menerima pesanan Anda
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-semibold">Sedang Diproses</div>
                  <div className="text-sm text-slate-600">
                    Pesanan Anda sedang disiapkan
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-semibold">Dalam Pengiriman</div>
                  <div className="text-sm text-slate-600">
                    Pesanan akan segera dikirim
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">
              Informasi Penting
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Konfirmasi pesanan telah dikirim ke email Anda</li>
              <li>• Estimasi pengiriman 2-3 hari kerja</li>
              <li>• Anda dapat melacak pesanan melalui email</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="outline">
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg">
                Lanjut Belanja
              </Button>
            </Link>
          </div>
          </motion.div>
        </main>
      </div>
    )
  }
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    }>
      <OrderContent />
    </Suspense>
  )
}
