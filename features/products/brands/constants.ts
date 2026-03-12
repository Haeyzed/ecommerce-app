import { CheckCircle, XCircle } from "lucide-react"

export const statusOptions = [
  { label: "Active", value: "active", icon: CheckCircle },
  { label: "Inactive", value: "inactive", icon: XCircle },
] as const
