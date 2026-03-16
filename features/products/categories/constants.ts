import { CheckCircle, XCircle } from "lucide-react"

export const PERMISSIONS = {
  create: "create categories",
  update: "update categories",
  delete: "delete categories",
  view: "view categories",
  import: "import categories",
  export: "export categories",
} as const

export const isActiveOptions = [
  { label: "Active", value: "1", icon: CheckCircle },
  { label: "Inactive", value: "0", icon: XCircle },
] as const

export const featuredOptions = [
  { label: "Yes", value: "1", icon: CheckCircle },
  { label: "No", value: "0", icon: XCircle },
] as const

export const syncOptions = [
  { label: "Enabled", value: "0", icon: CheckCircle },
  { label: "Disabled", value: "1", icon: XCircle },
] as const

export const CATEGORY_EXPORT_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "slug", label: "Slug" },
  { value: "short_description", label: "Short Description" },
  { value: "page_title", label: "Page Title" },
  { value: "image_url", label: "Image URL" },
  { value: "icon_url", label: "Icon URL" },
  { value: "is_active", label: "Is Active" },
  { value: "featured", label: "Featured" },
  { value: "is_sync_disable", label: "Sync Disabled" },
  { value: "parent_id", label: "Parent ID" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
] as const

export const DEFAULT_EXPORT_COLUMNS = [
  "id",
  "name",
  "slug",
  "is_active",
  "parent_id",
] as const
