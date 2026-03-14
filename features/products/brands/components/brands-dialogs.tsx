"use client"

import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import { BrandsActionDialog } from "./brands-action-dialog"
import { BrandsDeleteDialog } from "./brands-delete-dialog"
import { BrandsExportDialog } from "./brands-export-dialog"
import { BrandsImportDialog } from "./brands-import-dialog"
import { useBrandsContext } from "./brands-provider"
import { BrandsViewDialog } from "./brands-view-dialog"

export function BrandsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBrandsContext()
  const { data: session } = useAuthSession()
  const userPermissions = (session?.user as { user_permissions?: string[] } | undefined)
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
        <BrandsActionDialog
          key="brand-add"
          open={open === "add"}
          onOpenChange={(v) => !v && setOpen("add")}
        />
      )}

      {canImport && (
        <BrandsImportDialog
          key="brand-import"
          open={open === "import"}
          onOpenChange={(v) => !v && setOpen("import")}
        />
      )}

      {canExport && (
        <BrandsExportDialog
          key="brand-export"
          open={open === "export"}
          onOpenChange={(v) => !v && setOpen("export")}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <BrandsActionDialog
              key={`brand-edit-${currentRow.id}`}
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
            <BrandsViewDialog
              key={`brand-view-${currentRow.id}`}
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
            <BrandsDeleteDialog
              key={`brand-delete-${currentRow.id}`}
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
