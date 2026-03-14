"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBrandsContext } from "./brands-provider"

export function BrandsPrimaryButtons() {
  const { setOpen } = useBrandsContext()

  return (
    <Button onClick={() => setOpen("add")} aria-label="Add Brand">
      <Plus className="size-4" />
      <span className="ml-2">Add Brand</span>
    </Button>
  )
}
