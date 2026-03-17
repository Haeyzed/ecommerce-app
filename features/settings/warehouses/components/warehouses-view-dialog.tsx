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

import type { Warehouse } from "../types"

interface WarehousesViewDialogProps {
  currentRow: Warehouse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WarehousesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: WarehousesViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Warehouse Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            View warehouse information below.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-2">
          <WarehouseViewContent currentRow={currentRow} />
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

function WarehouseViewContent({ currentRow }: { currentRow: Warehouse }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Name</div>
          <div className="text-sm font-medium">{currentRow.name}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Phone Number
          </div>
          <div className="font-mono text-sm">{currentRow.phone_number}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Email</div>
        <div className="text-sm">{currentRow.email ?? "—"}</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Address</div>
        <div className="text-sm whitespace-pre-wrap">{currentRow.address}</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Status</div>
        <Badge variant="outline" className="capitalize">
          {currentRow.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Created At
          </div>
          <div className="text-sm text-muted-foreground">
            {currentRow.created_at
              ? new Date(currentRow.created_at).toLocaleString()
              : "N/A"}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Updated At
          </div>
          <div className="text-sm text-muted-foreground">
            {currentRow.updated_at
              ? new Date(currentRow.updated_at).toLocaleString()
              : "N/A"}
          </div>
        </div>
      </div>
    </div>
  )
}
