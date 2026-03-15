"use client"

import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

import type { Unit } from "../types"

interface UnitsViewDialogProps {
  currentRow: Unit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnitsViewDialog({
  currentRow,
  open,
  onOpenChange,
}: UnitsViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Unit details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            View full details for this unit.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Name: </span>
              <span>{currentRow.name}</span>
            </div>
            <div>
              <span className="font-medium">Code: </span>
              <span>{currentRow.code}</span>
            </div>
            <div>
              <span className="font-medium">Base unit: </span>
              <span>{currentRow.base_unit_relation?.name ?? "—"}</span>
            </div>
            <div>
              <span className="font-medium">Operator: </span>
              <span>{currentRow.operator ?? "—"}</span>
            </div>
            <div>
              <span className="font-medium">Operation value: </span>
              <span>
                {currentRow.operation_value != null
                  ? currentRow.operation_value
                  : "—"}
              </span>
            </div>
            <div>
              <span className="font-medium">Status: </span>
              <span>{currentRow.is_active ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

