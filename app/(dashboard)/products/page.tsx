import { ProductsClient } from "@/features/products/products"

export const metadata = {
  title: "Products",
  description: "Manage your products and their visibility.",
}

export default function ProductsPage() {
  return <ProductsClient />
}
