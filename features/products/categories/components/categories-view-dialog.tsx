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

import type { Category } from "../types"

interface CategoriesViewDialogProps {
  currentRow: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoriesViewDialog({
  currentRow,
  open,
  onOpenChange,
}: CategoriesViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Category Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            View category information below.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-2">
          <CategoryViewContent currentRow={currentRow} />
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

function CategoryViewContent({ currentRow }: { currentRow: Category }) {
  return (
    <div className="space-y-6">
      {(currentRow.image_url || currentRow.icon_url) && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Image / Icon
          </div>
          <div className="flex gap-4">
            {currentRow.image_url && (
              <div className="relative h-32 w-32 overflow-hidden rounded-md border bg-muted">
                <ImageZoom>
                  <Image
                    src={currentRow.image_url}
                    alt={currentRow.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </ImageZoom>
              </div>
            )}
            {currentRow.icon_url && (
              <div className="relative h-32 w-32 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={currentRow.icon_url}
                  alt={`${currentRow.name} icon`}
                  width={128}
                  height={128}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </div>
            )}
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

      {currentRow.parent?.name && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Parent Category
          </div>
          <div className="text-sm">{currentRow.parent.name}</div>
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

      <div className="flex flex-wrap gap-2">
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">
            Status
          </div>
          <Badge variant="outline" className="capitalize">
            {currentRow.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">
            Featured
          </div>
          <Badge variant="outline" className="capitalize">
            {currentRow.featured ? "Yes" : "No"}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">Sync</div>
          <Badge variant="outline" className="capitalize">
            {currentRow.is_sync_disable ? "Disabled" : "Enabled"}
          </Badge>
        </div>
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
