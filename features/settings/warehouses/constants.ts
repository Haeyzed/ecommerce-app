import { CheckCircle, XCircle } from "lucide-react"

export const PERMISSIONS = {
  create: "create warehouses",
  update: "update warehouses",
  delete: "delete warehouses",
  view: "view warehouses",
  import: "import warehouses",
  export: "export warehouses",
} as const

export const isActiveOptions = [
  { label: "Active", value: "1", icon: CheckCircle },
  { label: "Inactive", value: "0", icon: XCircle },
] as const

export const WAREHOUSE_EXPORT_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "phone_number", label: "Phone Number" },
  { value: "email", label: "Email" },
  { value: "address", label: "Address" },
  { value: "is_active", label: "Is Active" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
] as const

export const DEFAULT_EXPORT_COLUMNS = [
  "id",
  "name",
  "phone_number",
  "is_active",
] as const
