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

import type { Tax } from "../types"

interface TaxesViewDialogProps {
  currentRow: Tax
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaxesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: TaxesViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Tax Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            View tax information below.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-2">
          <TaxViewContent currentRow={currentRow} />
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

function TaxViewContent({ currentRow }: { currentRow: Tax }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Name</div>
          <div className="text-sm font-medium">{currentRow.name}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Rate (%)
          </div>
          <div className="font-mono text-sm">{currentRow.rate}%</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          WooCommerce Tax ID
        </div>
        <div className="text-sm">
          {currentRow.woocommerce_tax_id ?? "—"}
        </div>
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
