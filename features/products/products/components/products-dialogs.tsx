"use client"

import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import { ProductsActionDialog } from "./products-action-dialog"
import { ProductsDeleteDialog } from "./products-delete-dialog"
import { ProductsExportDialog } from "./products-export-dialog"
import { ProductsImportDialog } from "./products-import-dialog"
import { useProductsContext } from "./products-provider"
import { ProductsViewDialog } from "./products-view-dialog"

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProductsContext()
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canCreate = userPermissions.includes(PERMISSIONS.create)
  const canUpdate = userPermissions.includes(PERMISSIONS.update)
  const canDelete = userPermissions.includes(PERMISSIONS.delete)
  const canView = userPermissions.includes(PERMISSIONS.view)
  const canImport = userPermissions.includes(PERMISSIONS.import)
  const canExport = userPermissions.includes(PERMISSIONS.export)

  return (
    <>
      {canCreate && (
        <ProductsActionDialog
          key="product-add"
          open={open === "add"}
          onOpenChange={(v) => !v && setOpen("add")}
        />
      )}

      {canImport && (
        <ProductsImportDialog
          key="product-import"
          open={open === "import"}
          onOpenChange={(v) => !v && setOpen("import")}
        />
      )}

      {canExport && (
        <ProductsExportDialog
          key="product-export"
          open={open === "export"}
          onOpenChange={(v) => !v && setOpen("export")}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <ProductsActionDialog
              key={`product-edit-${currentRow.id}`}
              open={open === "edit"}
              onOpenChange={(v) => {
                if (!v) {
                  setOpen("edit")
                  setTimeout(() => setCurrentRow(null), 500)
                }
              }}
              currentRow={currentRow}
            />
          )}

          {canView && (
            <ProductsViewDialog
              key={`product-view-${currentRow.id}`}
              open={open === "view"}
              onOpenChange={(v) => {
                if (!v) {
                  setOpen("view")
                  setTimeout(() => setCurrentRow(null), 500)
                }
              }}
              currentRow={currentRow}
            />
          )}

          {canDelete && (
            <ProductsDeleteDialog
              key={`product-delete-${currentRow.id}`}
              open={open === "delete"}
              onOpenChange={(v) => {
                if (!v) {
                  setOpen("delete")
                  setTimeout(() => setCurrentRow(null), 500)
                }
              }}
              currentRow={currentRow}
            />
          )}
        </>
      )}
    </>
  )
}
