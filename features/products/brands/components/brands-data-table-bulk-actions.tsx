"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { CheckCircle2, CircleSlash, Trash2 } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"

import { Button } from "@/components/ui/button"
import { DataTableBulkActions } from "@/components/data-table/data-table-bulk-actions"
import { useAuthSession } from "@/features/auth/api"

import { useBulkActivateBrands, useBulkDeactivateBrands } from "../api"
import { PERMISSIONS } from "../constants"
import type { Brand } from "../types"
import { BrandsMultiDeleteDialog } from "./brands-multi-delete-dialog"

export interface BrandsDataTableBulkActionsProps {
  table: Table<Brand>
}

export function BrandsDataTableBulkActions({
  table,
}: BrandsDataTableBulkActionsProps) {
  const [showMultiDelete, setShowMultiDelete] = useState(false)
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canUpdate = userPermissions.includes(PERMISSIONS.update)
  const canDelete = userPermissions.includes(PERMISSIONS.delete)

  const { mutate: activateBrands, isPending: isActivating } =
    useBulkActivateBrands()
  const { mutate: deactivateBrands, isPending: isDeactivating } =
    useBulkDeactivateBrands()

  const isBusy = isActivating || isDeactivating

  const handleBulkActivate = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
    activateBrands(selectedIds, { onSuccess: () => table.resetRowSelection() })
  }

  const handleBulkDeactivate = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
    deactivateBrands(selectedIds, {
      onSuccess: () => table.resetRowSelection(),
    })
  }

  return (
    <>
      <DataTableBulkActions table={table} entityName="brand">
        {canUpdate && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkActivate}
              disabled={isBusy}
              className="size-8"
              aria-label="Activate selected brands"
            >
              {isActivating ? (
                <Spinner className="size-4" />
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
                <Spinner className="size-4" />
              ) : (
                <CircleSlash className="size-4" />
              )}
            </Button>
          </>
        )}
        {canDelete && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowMultiDelete(true)}
            disabled={isBusy}
            className="size-8"
            aria-label="Delete selected brands"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </DataTableBulkActions>

      <BrandsMultiDeleteDialog
        open={showMultiDelete}
        onOpenChange={setShowMultiDelete}
        table={table}
      />
    </>
  )
}
