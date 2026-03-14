"use client"

import { BrandsActionDialog } from "./brands-action-dialog"
import { BrandsDeleteDialog } from "./brands-delete-dialog"
import { useBrandsContext } from "./brands-provider"

export function BrandsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBrandsContext()

  return (
    <>
      <BrandsActionDialog
        key="brand-add"
        open={open === "add"}
        onOpenChange={(v) => !v && setOpen("add")}
      />

      {currentRow && (
        <>
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
        </>
      )}
    </>
  )
}
