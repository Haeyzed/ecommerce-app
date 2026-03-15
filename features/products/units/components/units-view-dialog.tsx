"use client"

import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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
          <ResponsiveDialogTitle>Unit Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            View measurement unit information below.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-2">
          <UnitViewContent currentRow={currentRow} />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function UnitViewContent({ currentRow }: { currentRow: Unit }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Name</div>
          <div className="text-sm font-medium">{currentRow.name}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Code</div>
          <div className="font-mono text-sm">{currentRow.code}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Base Unit</div>
        <div className="text-sm">
          {currentRow.base_unit_relation?.name ?? "None (Base Unit)"}
        </div>
      </div>

      {(currentRow.operator || currentRow.operation_value) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Operator</div>
            <div className="text-sm">{currentRow.operator ?? "—"}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Value</div>
            <div className="text-sm">{currentRow.operation_value ?? "—"}</div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Status</div>
        <Badge variant="outline" className="capitalize">
          {currentRow.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Created At</div>
          <div className="text-sm text-muted-foreground">
            {currentRow.created_at ? new Date(currentRow.created_at).toLocaleString() : "N/A"}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Updated At</div>
          <div className="text-sm text-muted-foreground">
            {currentRow.updated_at ? new Date(currentRow.updated_at).toLocaleString() : "N/A"}
          </div>
        </div>
      </div>
    </div>
  )
}