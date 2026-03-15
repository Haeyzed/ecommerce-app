"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, Text, XCircle } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ImageZoomCell } from "@/components/image-zoom"
import { LongText } from "@/components/long-text"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { featuredOptions, isActiveOptions, syncOptions } from "../constants"
import type { Category } from "../types"
import { CategoriesDataTableRowActions } from "./categories-data-table-row-actions"

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        "start-0 z-10 w-10 max-w-10 min-w-10 rounded-tl-[inherit] bg-background max-md:sticky"
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3 ps-3">
        {row.original.image_url ? (
          <ImageZoomCell src={row.original.image_url} alt={row.original.name} />
        ) : row.original.icon_url ? (
          <ImageZoomCell src={row.original.icon_url} alt={row.original.name} />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-md bg-muted">
            <span className="text-xs font-medium">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <LongText className="max-w-36">{row.original.name}</LongText>
      </div>
    ),
    meta: {
      label: "Name",
      placeholder: "Search names...",
      variant: "text",
      icon: Text,
      className: cn(
        "bg-background drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky max-md:start-10 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableColumnFilter: true,
  },
  {
    id: "slug",
    accessorKey: "slug",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Slug" />
    ),
    cell: ({ cell }) => (
      <div className="text-muted-foreground">
        {cell.getValue<Category["slug"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "short_description",
    accessorKey: "short_description",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Description" />
    ),
    cell: ({ cell }) => (
      <div className="max-w-[200px] truncate text-muted-foreground">
        {cell.getValue<Category["short_description"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "parent",
    accessorKey: "parent.name",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Parent" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.parent?.name ?? "-"}
      </div>
    ),
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<Category["is_active"]>()
      const Icon = isActive ? CheckCircle2 : XCircle
      return (
        <Badge variant="outline" className="capitalize">
          <Icon className="size-3.5" />
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: isActiveOptions.map((o) => ({
        label: o.label,
        value: o.value,
        icon: o.icon,
      })),
    },
    enableColumnFilter: true,
  },
  {
    id: "featured",
    accessorKey: "featured",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Featured" />
    ),
    cell: ({ cell }) => {
      const featured = cell.getValue<Category["featured"]>()
      const Icon = featured ? CheckCircle2 : XCircle
      return (
        <Badge variant="outline" className="capitalize">
          <Icon className="size-3.5" />
          {featured ? "Yes" : "No"}
        </Badge>
      )
    },
    meta: {
      label: "Featured",
      variant: "multiSelect",
      options: featuredOptions.map((o) => ({
        label: o.label,
        value: o.value,
        icon: o.icon,
      })),
    },
    enableColumnFilter: true,
  },
  {
    id: "is_sync_disable",
    accessorKey: "is_sync_disable",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Sync" />
    ),
    cell: ({ cell }) => {
      const isSyncDisable = cell.getValue<Category["is_sync_disable"]>()
      const Icon = isSyncDisable ? XCircle : CheckCircle2
      return (
        <Badge variant="outline" className="capitalize">
          <Icon className="size-3.5" />
          {isSyncDisable ? "Disabled" : "Enabled"}
        </Badge>
      )
    },
    meta: {
      label: "Sync",
      variant: "multiSelect",
      options: syncOptions.map((o) => ({
        label: o.label,
        value: o.value,
        icon: o.icon,
      })),
    },
    enableColumnFilter: true,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<Category["created_at"]>()
      if (!raw) return <span className="text-muted-foreground">—</span>
      const d = new Date(raw)
      return (
        <span className="text-muted-foreground">
          {Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString()}
        </span>
      )
    },
    meta: {
      label: "Created",
      variant: "dateRange",
      className: "w-28",
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoriesDataTableRowActions row={row} />,
    size: 32,
    meta: {
      className: cn(
        "end-0 z-10 rounded-tr-[inherit] bg-background max-md:sticky"
      ),
    },
  },
]
