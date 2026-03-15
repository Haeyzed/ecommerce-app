import { CheckCircle, XCircle } from "lucide-react"

export const PERMISSIONS = {
  create: "create brands",
  update: "update brands",
  delete: "delete brands",
  view: "view brands",
  import: "import brands",
  export: "export brands",
} as const

export const isActiveOptions = [
  { label: "Active", value: "1", icon: CheckCircle },
  { label: "Inactive", value: "0", icon: XCircle },
] as const

export const BRAND_EXPORT_COLUMNS = [
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

export const DEFAULT_EXPORT_COLUMNS = ["id", "name", "slug", "is_active"] as const
