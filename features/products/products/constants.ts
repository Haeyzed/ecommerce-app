import { CheckCircle, XCircle } from "lucide-react"
import { ProductTypeEnum } from "./types"

export const PERMISSIONS = {
  create: "create products",
  update: "update products",
  delete: "delete products",
  view: "view products",
  import: "import products",
  export: "export products",
} as const

export const isActiveOptions = [
  { label: "Active", value: "1", icon: CheckCircle },
  { label: "Inactive", value: "0", icon: XCircle },
] as const

export const featuredOptions = [
  { label: "Yes", value: "1", icon: CheckCircle },
  { label: "No", value: "0", icon: XCircle },
] as const

export const productTypeOptions = [
  { label: "Standard", value: ProductTypeEnum.Standard },
  { label: "Combo", value: ProductTypeEnum.Combo },
  { label: "Digital", value: ProductTypeEnum.Digital },
  { label: "Service", value: ProductTypeEnum.Service },
] as const

export const PRODUCT_EXPORT_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "slug", label: "Slug" },
  { value: "short_description", label: "Short Description" },
  { value: "page_title", label: "Page Title" },
  { value: "image_url", label: "Image URL" },
  { value: "is_active", label: "Is Active" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
] as const

export const DEFAULT_EXPORT_COLUMNS = [
  "id",
  "name",
  "slug",
  "is_active",
] as const
