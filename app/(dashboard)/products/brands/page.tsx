import { BrandsClient } from "@/features/products/brands"
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "Manage your brands and their visibility.",
}

export default function BrandsPage() {
  return <BrandsClient />
}
