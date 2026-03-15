"use client"

import Image from "next/image"
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
import { ImageZoom } from "@/components/ui/image-zoom"

import type { Brand } from "../types"

interface BrandsViewDialogProps {
  currentRow: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandsViewDialog({
  currentRow,
  open,
  onOpenChange,
}: BrandsViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Brand Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            View brand information below.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-2">
          <BrandViewContent currentRow={currentRow} />
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

function BrandViewContent({ currentRow }: { currentRow: Brand }) {
  return (
    <div className="space-y-6">
      {currentRow.image_url && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Image</div>
          <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
            <ImageZoom>
              <Image
                src={currentRow.image_url}
                alt={currentRow.name}
                width={800}
                height={400}
                className="h-full w-full object-cover"
                unoptimized
              />
            </ImageZoom>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Name</div>
        <div className="text-sm font-medium">{currentRow.name}</div>
      </div>

      {currentRow.slug && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Slug</div>
          <div className="font-mono text-sm text-muted-foreground">
            {currentRow.slug}
          </div>
        </div>
      )}

      {currentRow.short_description && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Description
          </div>
          <div className="text-sm whitespace-pre-wrap text-muted-foreground">
            {currentRow.short_description}
          </div>
        </div>
      )}

      {currentRow.page_title && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Page Title
          </div>
          <div className="text-sm">{currentRow.page_title}</div>
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
