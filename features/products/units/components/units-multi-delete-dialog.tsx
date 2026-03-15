"use client"

import type { Table } from "@tanstack/react-table"

import { AlertDialogFooter } from "@/components/ui/alert-dialog"
import {
  ConfirmationDialog,
  ConfirmationDialogBody,
  ConfirmationDialogCancel,
  ConfirmationDialogContent,
  ConfirmationDialogDescription,
  ConfirmationDialogHeader,
  ConfirmationDialogTitle,
  ConfirmationDialogTrigger,
} from "@/components/ui/confirmation-dialog"
import { Button } from "@/components/ui/button"

import type { Unit } from "../types"

interface UnitsMultiDeleteDialogProps {
  table: Table<Unit>
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

export function UnitsMultiDeleteDialog({
  table,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: UnitsMultiDeleteDialogProps) {
  const selectedCount =
    table.getFilteredSelectedRowModel().rows.length ?? 0

  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange}>
      <ConfirmationDialogTrigger asChild>
        <span />
      </ConfirmationDialogTrigger>
      <ConfirmationDialogContent>
        <ConfirmationDialogHeader>
          <ConfirmationDialogTitle>
            Delete selected units?
          </ConfirmationDialogTitle>
          <ConfirmationDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold">{selectedCount}</span>{" "}
            selected unit{selectedCount === 1 ? "" : "s"}.
          </ConfirmationDialogDescription>
        </ConfirmationDialogHeader>
        <ConfirmationDialogBody>
          <AlertDialogFooter>
            <ConfirmationDialogCancel asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </ConfirmationDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </ConfirmationDialogBody>
      </ConfirmationDialogContent>
    </ConfirmationDialog>
  )
}

