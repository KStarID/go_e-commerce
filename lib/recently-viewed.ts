const STORAGE_KEY = "recently_viewed"
const MAX_ITEMS = 8

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
}

export function getRecentlyViewed(): Product[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function addRecentlyViewed(product: Product) {
  const items = getRecentlyViewed().filter((p) => p.id !== product.id)
  items.unshift(product)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
}
