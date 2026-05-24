import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ShoesStore</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Toko sepatu online terpercaya dengan koleksi terlengkap dan harga terbaik.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Keranjang</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Pesanan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@shoesstore.com</li>
              <li>Tel: 021-1234-5678</li>
              <li>Jam: Senin-Jumat 09:00-17:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ShoesStore. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
