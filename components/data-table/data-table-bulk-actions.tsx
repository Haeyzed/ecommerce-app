"use client"

import type { Table } from "@tanstack/react-table"
import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
  entityName: string
  children: React.ReactNode
}

/**
 * Toolbar shown when table rows are selected. Renders a fixed bottom bar with
 * clear button, selection count, and custom action buttons.
 */
export function DataTableBulkActions<TData>({
  table,
  entityName,
  children,
}: DataTableBulkActionsProps<TData>): React.ReactNode | null {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    if (selectedCount > 0) {
      const msg = `${selectedCount} ${entityName}${selectedCount > 1 ? "s" : ""} selected. Bulk actions available.`
      queueMicrotask(() => setAnnouncement(msg))
      const t = setTimeout(() => setAnnouncement(""), 3000)
      return () => clearTimeout(t)
    }
  }, [selectedCount, entityName])

  const handleClearSelection = () => {
    table.resetRowSelection()
  }

  if (selectedCount === 0) {
    return null
  }

  return (
    <>
      <div aria-live="polite" aria-atomic className="sr-only" role="status">
        {announcement}
      </div>
      <div
        ref={toolbarRef}
        role="toolbar"
        aria-label={`Bulk actions for ${selectedCount} selected ${entityName}${selectedCount > 1 ? "s" : ""}`}
        className={cn(
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl",
          "transition-all delay-100 duration-300 ease-out",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-x-2 rounded-xl border p-2 shadow-xl",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          )}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearSelection}
            className="size-6 rounded-full"
            aria-label="Clear selection"
          >
            <span className="sr-only">Clear selection</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
          <Separator className="h-5" orientation="vertical" aria-hidden />
          <div className="flex items-center gap-x-1 text-sm">
            <Badge variant="default" className="min-w-8 rounded-lg">
              {selectedCount}
            </Badge>
            <span className="hidden sm:inline">
              {entityName}
              {selectedCount > 1 ? "s" : ""} selected
            </span>
          </div>
          <Separator className="h-5" orientation="vertical" aria-hidden />
          {children}
        </div>
      </div>
    </>
  )
}
