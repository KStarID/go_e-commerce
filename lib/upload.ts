import { supabase } from "./supabase"

export async function uploadProductImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file)

  if (error) {
    console.error("Upload error:", error)
    return null
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath)

  return data.publicUrl
}
