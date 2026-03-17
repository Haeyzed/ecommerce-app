import { CategoriesClient } from "@/features/products/categories"
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage your product categories and hierarchy.",
}

export default function CategoriesPage() {
  return <CategoriesClient />
}
