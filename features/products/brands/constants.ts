import { CheckCircle, XCircle } from "lucide-react"

/** Options for is_active filter; value "true"/"false" maps to API boolean */
export const isActiveOptions = [
  { label: "Active", value: "true", icon: CheckCircle },
  { label: "Inactive", value: "false", icon: XCircle },
] as const
