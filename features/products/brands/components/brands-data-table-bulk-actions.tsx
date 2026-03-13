"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { CheckCircle2, CircleSlash, Loader2, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTableBulkActions } from "@/components/data-table/data-table-bulk-actions"

import { useBulkActivateBrands, useBulkDeactivateBrands, useBulkDestroyBrands } from "../api"
import type { Brand } from "../types"

export interface BrandsDataTableBulkActionsProps {
  table: Table<Brand>
}

export function BrandsDataTableBulkActions({ table }: BrandsDataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => row.original.id)

  const { mutate: activateBrands, isPending: isActivating } = useBulkActivateBrands()
  const { mutate: deactivateBrands, isPending: isDeactivating } = useBulkDeactivateBrands()
  const { mutate: destroyBrands, isPending: isDeleting } = useBulkDestroyBrands()

  const isBusy = isActivating || isDeactivating || isDeleting

  const handleBulkActivate = () => {
    activateBrands(selectedIds, { onSuccess: () => table.resetRowSelection() })
  }

  const handleBulkDeactivate = () => {
    deactivateBrands(selectedIds, { onSuccess: () => table.resetRowSelection() })
  }

  const handleBulkDelete = () => {
    destroyBrands(selectedIds, {
      onSuccess: () => {
        table.resetRowSelection()
        setShowDeleteConfirm(false)
      },
    })
  }

  return (
    <>
      <DataTableBulkActions table={table} entityName="brand">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBulkActivate}
          disabled={isBusy}
          className="size-8"
          aria-label="Activate selected brands"
        >
          {isActivating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleBulkDeactivate}
          disabled={isBusy}
          className="size-8"
          aria-label="Deactivate selected brands"
        >
          {isDeactivating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CircleSlash className="size-4" />
          )}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isBusy}
          className="size-8"
          aria-label="Delete selected brands"
        >
          <Trash2 className="size-4" />
        </Button>
      </DataTableBulkActions>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected brands?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedIds.length} brand
              {selectedIds.length > 1 ? "s" : ""}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleBulkDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
