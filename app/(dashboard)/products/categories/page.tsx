import { CategoriesClient } from "@/features/products/categories"

export const metadata = {
  title: "Categories",
  description: "Manage your product categories and hierarchy.",
}

export default function CategoriesPage() {
  return <CategoriesClient />
}
