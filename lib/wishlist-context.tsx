"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
}

interface WishlistContextType {
  items: Product[]
  toggleItem: (product: Product) => void
  isInWishlist: (id: string) => boolean
  removeItem: (id: string) => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("wishlist")
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const toggleItem = (product: Product) => {
    setItems(prev => prev.some(i => i.id === product.id)
      ? prev.filter(i => i.id !== product.id)
      : [...prev, product])
  }

  const isInWishlist = (id: string) => items.some(i => i.id === id)

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <WishlistContext.Provider value={{
      items, toggleItem, isInWishlist, removeItem,
      totalItems: items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within WishlistProvider")
  return context
}
