import { ProductsClient } from "@/features/products/products"
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products and their visibility.",
}

export default function ProductsPage() {
  return <ProductsClient />
}
