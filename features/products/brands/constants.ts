import { CheckCircle, XCircle } from "lucide-react"

/** Options for is_active filter; value 1 = active, 0 = inactive (sent as array to API). */
export const isActiveOptions = [
  { label: "Active", value: "1", icon: CheckCircle },
  { label: "Inactive", value: "0", icon: XCircle },
] as const
