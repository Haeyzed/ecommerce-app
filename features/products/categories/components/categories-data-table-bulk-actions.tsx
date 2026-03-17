"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { CheckCircle2, CircleSlash, Star, StarOff, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTableBulkActions } from "@/components/data-table/data-table-bulk-actions"
import { Spinner } from "@/components/ui/spinner"
import { useAuthSession } from "@/features/auth/api"

import {
  useBulkActivateCategories,
  useBulkDeactivateCategories,
  useBulkDisableFeaturedCategories,
  useBulkEnableFeaturedCategories,
  useBulkEnableSyncCategories,
  useBulkDisableSyncCategories,
} from "../api"
import { PERMISSIONS } from "../constants"
import type { Category } from "../types"
import { CategoriesMultiDeleteDialog } from "./categories-multi-delete-dialog"

export interface CategoriesDataTableBulkActionsProps {
  table: Table<Category>
}

export function CategoriesDataTableBulkActions({
  table,
}: CategoriesDataTableBulkActionsProps) {
  const [showMultiDelete, setShowMultiDelete] = useState(false)
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canUpdate = userPermissions.includes(PERMISSIONS.update)
  const canDelete = userPermissions.includes(PERMISSIONS.delete)

  const { mutate: activate, isPending: isActivating } =
    useBulkActivateCategories()
  const { mutate: deactivate, isPending: isDeactivating } =
    useBulkDeactivateCategories()
  const { mutate: enableFeatured, isPending: isEnablingFeatured } =
    useBulkEnableFeaturedCategories()
  const { mutate: disableFeatured, isPending: isDisablingFeatured } =
    useBulkDisableFeaturedCategories()
  const { mutate: enableSync, isPending: isEnablingSync } =
    useBulkEnableSyncCategories()
  const { mutate: disableSync, isPending: isDisablingSync } =
    useBulkDisableSyncCategories()

  const isBusy =
    isActivating ||
    isDeactivating ||
    isEnablingFeatured ||
    isDisablingFeatured ||
    isEnablingSync ||
    isDisablingSync

  const getSelectedIds = () =>
    table.getFilteredSelectedRowModel().rows.map((row) => row.original.id)

  const handleBulkActivate = () => {
    activate(getSelectedIds(), { onSuccess: () => table.resetRowSelection() })
  }
  const handleBulkDeactivate = () => {
    deactivate(getSelectedIds(), { onSuccess: () => table.resetRowSelection() })
  }
  const handleBulkEnableFeatured = () => {
    enableFeatured(getSelectedIds(), {
      onSuccess: () => table.resetRowSelection(),
    })
  }
  const handleBulkDisableFeatured = () => {
    disableFeatured(getSelectedIds(), {
      onSuccess: () => table.resetRowSelection(),
    })
  }
  const handleBulkEnableSync = () => {
    enableSync(getSelectedIds(), { onSuccess: () => table.resetRowSelection() })
  }
  const handleBulkDisableSync = () => {
    disableSync(getSelectedIds(), {
      onSuccess: () => table.resetRowSelection(),
    })
  }

  return (
    <>
      <DataTableBulkActions table={table} entityName="category">
        {canUpdate && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkActivate}
              disabled={isBusy}
              className="size-8"
              aria-label="Activate selected categories"
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
              aria-label="Deactivate selected categories"
            >
              {isDeactivating ? (
                <Spinner className="size-4" />
              ) : (
                <CircleSlash className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkEnableFeatured}
              disabled={isBusy}
              className="size-8"
              aria-label="Enable featured for selected"
            >
              {isEnablingFeatured ? (
                <Spinner className="size-4" />
              ) : (
                <Star className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkDisableFeatured}
              disabled={isBusy}
              className="size-8"
              aria-label="Disable featured for selected"
            >
              {isDisablingFeatured ? (
                <Spinner className="size-4" />
              ) : (
                <StarOff className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkEnableSync}
              disabled={isBusy}
              className="size-8"
              aria-label="Enable sync for selected"
            >
              {isEnablingSync ? (
                <Spinner className="size-4" />
              ) : (
                <span className="text-xs">Sync On</span>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleBulkDisableSync}
              disabled={isBusy}
              className="size-8"
              aria-label="Disable sync for selected"
            >
              {isDisablingSync ? (
                <Spinner className="size-4" />
              ) : (
                <span className="text-xs">Sync Off</span>
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
            aria-label="Delete selected categories"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </DataTableBulkActions>

      <CategoriesMultiDeleteDialog
        open={showMultiDelete}
        onOpenChange={setShowMultiDelete}
        table={table}
      />
    </>
  )
}
