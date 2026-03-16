"use client"

import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import { UnitsActionDialog } from "./units-action-dialog"
import { UnitsDeleteDialog } from "./units-delete-dialog"
import { UnitsExportDialog } from "./units-export-dialog"
import { UnitsImportDialog } from "./units-import-dialog"
import { UnitsViewDialog } from "./units-view-dialog"
import { useUnitsContext } from "./units-provider"

export function UnitsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUnitsContext()
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
        <UnitsActionDialog
          key="unit-add"
          open={open === "add"}
          onOpenChange={(v) => !v && setOpen("add")}
        />
      )}

      {canImport && (
        <UnitsImportDialog
          key="unit-import"
          open={open === "import"}
          onOpenChange={(v) => !v && setOpen("import")}
        />
      )}

      {canExport && (
        <UnitsExportDialog
          key="unit-export"
          open={open === "export"}
          onOpenChange={(v) => !v && setOpen("export")}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <UnitsActionDialog
              key={`unit-edit-${currentRow.id}`}
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
            <UnitsViewDialog
              key={`unit-view-${currentRow.id}`}
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
            <UnitsDeleteDialog
              key={`unit-delete-${currentRow.id}`}
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
