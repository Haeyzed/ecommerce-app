"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { CheckCircle2, CircleSlash, Trash2 } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { DataTableBulkActions } from "@/components/data-table/data-table-bulk-actions"
import { useAuthSession } from "@/features/auth/api"

import {
  useBulkActivateWarehouses,
  useBulkDeactivateWarehouses,
} from "../api"
import { PERMISSIONS } from "../constants"
import type { Warehouse } from "../types"
import { WarehousesMultiDeleteDialog } from "./warehouses-multi-delete-dialog"

export interface WarehousesDataTableBulkActionsProps {
  table: Table<Warehouse>
}

export function WarehousesDataTableBulkActions({
  table,
}: WarehousesDataTableBulkActionsProps) {
  const [showMultiDelete, setShowMultiDelete] = useState(false)
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canUpdate = userPermissions.includes(PERMISSIONS.update)
  const canDelete = userPermissions.includes(PERMISSIONS.delete)

  const { mutate: activateWarehouses, isPending: isActivating } =
    useBulkActivateWarehouses()
  const { mutate: deactivateWarehouses, isPending: isDeactivating } =
    useBulkDeactivateWarehouses()

  const isBusy = isActivating || isDeactivating

  const handleBulkActivate = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
    activateWarehouses(selectedIds, {
      onSuccess: () => table.resetRowSelection(),
    })
  }

  const handleBulkDeactivate = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
    deactivateWarehouses(selectedIds, {
      onSuccess: () => table.resetRowSelection(),
    })
  }

  return (
    <>
      <DataTableBulkActions table={table} entityName="warehouse">
        {canUpdate && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkActivate}
              disabled={isBusy}
              className="size-8"
              aria-label="Activate selected warehouses"
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
              aria-label="Deactivate selected warehouses"
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
            aria-label="Delete selected warehouses"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </DataTableBulkActions>

      <WarehousesMultiDeleteDialog
        open={showMultiDelete}
        onOpenChange={setShowMultiDelete}
        table={table}
      />
    </>
  )
}
