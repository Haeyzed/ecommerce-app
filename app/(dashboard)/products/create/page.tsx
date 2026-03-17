import type { Metadata } from "next"

import { ProductFormClient } from "@/features/products/products"

export const metadata: Metadata = {
  title: "Create Product",
  description: "Create a new product.",
}

export default function CreateProductPage() {
  return <ProductFormClient />
}

