import { CheckCircle, XCircle } from "lucide-react"

export const PERMISSIONS = {
  create: "create units",
  update: "update units",
  delete: "delete units",
  view: "view units",
  import: "import units",
  export: "export units",
} as const

export const isActiveOptions = [
  { label: "Active", value: "1", icon: CheckCircle },
  { label: "Inactive", value: "0", icon: XCircle },
] as const

export const UNIT_EXPORT_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "code", label: "Code" },
  { value: "base_unit", label: "Base Unit ID" },
  { value: "operator", label: "Operator" },
  { value: "operation_value", label: "Operation Value" },
  { value: "is_active", label: "Is Active" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
] as const

export const DEFAULT_EXPORT_COLUMNS = [
  "id",
  "name",
  "code",
  "is_active",
] as const
