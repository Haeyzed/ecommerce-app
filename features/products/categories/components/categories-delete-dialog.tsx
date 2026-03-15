"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmResponsiveDialog } from "@/components/confirm-responsive-dialog"

import { useDeleteCategory } from "../api"
import type { Category } from "../types"

interface CategoriesDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Category
}

export function CategoriesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CategoriesDeleteDialogProps) {
  const [value, setValue] = React.useState("")
  const { mutate: deleteCategory, isPending } = useDeleteCategory()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return
    deleteCategory(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
        setValue("")
      },
    })
  }

  return (
    <ConfirmResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="text-destructive flex items-center gap-1">
          <AlertTriangle className="size-[18px] stroke-destructive" />
          Delete Category
        </span>
      }
      description={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the category from the system.
            This cannot be undone.
          </p>

          <Label className="my-2 block">
            Category Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter category name to confirm deletion."
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
      disabled={value.trim() !== currentRow.name}
      isLoading={isPending}
      onConfirm={handleDelete}
    />
  )
}
