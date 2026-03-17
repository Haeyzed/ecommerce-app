import { UnitsClient } from "@/features/products/units"
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Units",
  description: "Manage your measurement units and conversion factors.",
}

export default function UnitsPage() {
  return <UnitsClient />
}
