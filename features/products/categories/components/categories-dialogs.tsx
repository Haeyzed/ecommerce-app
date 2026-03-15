"use client"

import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import { CategoriesActionDialog } from "./categories-action-dialog"
import { CategoriesDeleteDialog } from "./categories-delete-dialog"
import { CategoriesExportDialog } from "./categories-export-dialog"
import { CategoriesImportDialog } from "./categories-import-dialog"
import { useCategoriesContext } from "./categories-provider"
import { CategoriesViewDialog } from "./categories-view-dialog"

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategoriesContext()
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
        <CategoriesActionDialog
          key="category-add"
          open={open === "add"}
          onOpenChange={(v) => !v && setOpen("add")}
        />
      )}

      {canImport && (
        <CategoriesImportDialog
          key="category-import"
          open={open === "import"}
          onOpenChange={(v) => !v && setOpen("import")}
        />
      )}

      {canExport && (
        <CategoriesExportDialog
          key="category-export"
          open={open === "export"}
          onOpenChange={(v) => !v && setOpen("export")}
          ids={[]}
        />
      )}

      {currentRow && (
        <>
          {canUpdate && (
            <CategoriesActionDialog
              key={`category-edit-${currentRow.id}`}
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
            <CategoriesViewDialog
              key={`category-view-${currentRow.id}`}
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
            <CategoriesDeleteDialog
              key={`category-delete-${currentRow.id}`}
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
