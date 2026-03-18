"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmResponsiveDialog } from "@/components/confirm-responsive-dialog"

import { useBulkDeleteTaxes } from "../api"
import type { Tax } from "../types"

const CONFIRM_WORD = "DELETE"

interface TaxesMultiDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Tax>
}

export function TaxesMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: TaxesMultiDeleteDialogProps) {
  const [value, setValue] = React.useState("")
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => row.original.id)

  const { mutate: bulkDestroy, isPending } = useBulkDeleteTaxes()

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }
    bulkDestroy(selectedIds, {
      onSuccess: () => {
        onOpenChange(false)
        setValue("")
        table.resetRowSelection()
      },
    })
  }

  return (
    <ConfirmResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-1 text-destructive">
          <AlertTriangle className="size-[18px] stroke-destructive" />
          Delete {selectedRows.length}{" "}
          {selectedRows.length > 1 ? "taxes" : "tax"}
        </span>
      }
      description={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete the selected taxes?
            <br />
            This action cannot be undone.
          </p>

          <Label className="my-4 flex flex-col items-start gap-1.5">
            <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              className="mt-1"
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
      disabled={value.trim() !== CONFIRM_WORD}
      isLoading={isPending}
      onConfirm={handleDelete}
    />
  )
}
