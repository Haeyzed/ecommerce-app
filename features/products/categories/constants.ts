import { CheckCircle, XCircle } from "lucide-react"
import type {
  CategoryActiveStatus,
  CategoryFeaturedStatus,
  CategorySyncStatus,
} from "./types"

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

export const statusTypes = new Map<CategoryActiveStatus, string>([
  ["active", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["inactive", "bg-neutral-300/40 border-neutral-300"],
])

export const featuredTypes = new Map<CategoryFeaturedStatus, string>([
  [
    "yes",
    "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200",
  ],
  ["no", "bg-slate-100/30 text-slate-600 dark:text-slate-400 border-slate-200"],
])

export const syncTypes = new Map<CategorySyncStatus, string>([
  [
    "enabled",
    "bg-indigo-100/30 text-indigo-900 dark:text-indigo-200 border-indigo-200",
  ],
  [
    "disabled",
    "bg-rose-100/30 text-rose-900 dark:text-rose-200 border-rose-200",
  ],
])

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
