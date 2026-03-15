"use client"

import type { Unit } from "../types"

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
import { AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteUnit } from "../api"

interface UnitsDeleteDialogProps {
  currentRow: Unit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnitsDeleteDialog({
  currentRow,
  open,
  onOpenChange,
}: UnitsDeleteDialogProps) {
  const { mutate: deleteUnit, isPending } = useDeleteUnit()

  const handleConfirm = () => {
    deleteUnit(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange}>
      <ConfirmationDialogTrigger asChild>
        <span />
      </ConfirmationDialogTrigger>
      <ConfirmationDialogContent>
        <ConfirmationDialogHeader>
          <ConfirmationDialogTitle>
            Delete unit &quot;{currentRow.name}&quot;?
          </ConfirmationDialogTitle>
          <ConfirmationDialogDescription>
            This action cannot be undone. This will permanently delete the unit.
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
              onClick={handleConfirm}
              disabled={isPending}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </ConfirmationDialogBody>
      </ConfirmationDialogContent>
    </ConfirmationDialog>
  )
}

