import type { Metadata } from "next"

import { ProductFormClient } from "@/features/products/products"

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product details.",
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const productId = Number(id)

  return <ProductFormClient productId={Number.isNaN(productId) ? undefined : productId} />
}

