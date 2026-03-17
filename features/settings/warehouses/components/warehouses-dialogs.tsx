"use client"

import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import { WarehousesActionDialog } from "./warehouses-action-dialog"
import { WarehousesDeleteDialog } from "./warehouses-delete-dialog"
import { WarehousesExportDialog } from "./warehouses-export-dialog"
import { WarehousesImportDialog } from "./warehouses-import-dialog"
import { WarehousesViewDialog } from "./warehouses-view-dialog"
import { useWarehousesContext } from "./warehouses-provider"

export function WarehousesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useWarehousesContext()
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
        <WarehousesActionDialog
          key="warehouse-add"
          open={open === "add"}
          onOpenChange={(v) => !v && setOpen("add")}
        />
      )}

      {canImport && (
        <WarehousesImportDialog
          key="warehouse-import"
          open={open === "import"}
          onOpenChange={(v) => !v && setOpen("import")}
        />
      )}

      {canExport && (
        <WarehousesExportDialog
          key="warehouse-export"
          open={open === "export"}
          onOpenChange={(v) => !v && setOpen("export")}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <WarehousesActionDialog
              key={`warehouse-edit-${currentRow.id}`}
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
            <WarehousesViewDialog
              key={`warehouse-view-${currentRow.id}`}
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
            <WarehousesDeleteDialog
              key={`warehouse-delete-${currentRow.id}`}
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
