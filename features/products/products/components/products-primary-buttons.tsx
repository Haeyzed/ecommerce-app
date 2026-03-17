"use client"

import { Download, Plus, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import { useProductsContext } from "./products-provider"

export function ProductsPrimaryButtons() {
  const router = useRouter()
  const { setOpen } = useProductsContext()
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canCreate = userPermissions.includes(PERMISSIONS.create)
  const canImport = userPermissions.includes(PERMISSIONS.import)
  const canExport = userPermissions.includes(PERMISSIONS.export)

  if (!canCreate && !canImport && !canExport) return null

  return (
    <div className="flex gap-2">
      {canExport && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen("export")}
          aria-label="Export Products"
        >
          <Download className="size-4" />
          <span className="ml-2 hidden sm:inline">Export</span>
        </Button>
      )}
      {canImport && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen("import")}
          aria-label="Import Products"
        >
          <Upload className="size-4" />
          <span className="ml-2 hidden sm:inline">Import</span>
        </Button>
      )}
      {canCreate && (
        <Button
          size="sm"
          onClick={() => router.push("/products/create")}
          aria-label="Add Product"
        >
          <Plus className="size-4" />
          <span className="ml-2 hidden sm:inline">Add Product</span>
        </Button>
      )}
    </div>
  )
}
