import { CheckCircle, XCircle } from "lucide-react"

export const PERMISSIONS = {
  create: "create taxes",
  update: "update taxes",
  delete: "delete taxes",
  view: "view taxes",
  import: "import taxes",
  export: "export taxes",
} as const

export const isActiveOptions = [
  { label: "Active", value: "1", icon: CheckCircle },
  { label: "Inactive", value: "0", icon: XCircle },
] as const

export const TAX_EXPORT_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "rate", label: "Rate" },
  { value: "woocommerce_tax_id", label: "WooCommerce Tax ID" },
  { value: "is_active", label: "Is Active" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
] as const

export const DEFAULT_EXPORT_COLUMNS = [
  "id",
  "name",
  "rate",
  "woocommerce_tax_id",
  "is_active",
] as const
