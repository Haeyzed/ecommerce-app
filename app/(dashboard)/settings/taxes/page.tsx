import { TaxesClient } from "@/features/settings/taxes"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Taxes",
  description: "Manage your tax rates and settings.",
}

export default function TaxesPage() {
  return <TaxesClient />
}
