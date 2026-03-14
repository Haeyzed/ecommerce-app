"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, MoreHorizontal, Text, XCircle } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { isActiveOptions } from "../constants"
import type { Brand } from "../types"
import { BrandsDataTableRowActions } from "./brands-data-table-row-actions"
import { LongText } from "@/components/long-text"
import { ImageZoomCell } from "@/components/image-zoom"

export const brandsColumns: ColumnDef<Brand>[] = [
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
        "w-10 min-w-10 max-w-10 bg-background max-md:sticky start-0 z-10 rounded-tl-[inherit]"
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
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3 ps-3'>
        {row.original.image_url ? (
          <ImageZoomCell src={row.original.image_url} alt={row.original.name} />
        ) : (
          <div className='flex size-10 items-center justify-center rounded-md bg-muted'>
            <span className='text-xs font-medium'>
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <LongText className='max-w-36'>{row.original.name}</LongText>
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
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} label="Slug" />
    ),
    cell: ({ cell }) => (
      <div className="text-muted-foreground">
        {cell.getValue<Brand["slug"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "short_description",
    accessorKey: "short_description",
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} label="Description" />
    ),
    cell: ({ cell }) => (
      <div className="max-w-[200px] truncate text-muted-foreground">
        {cell.getValue<Brand["short_description"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<Brand["is_active"]>()
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
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<Brand["created_at"]>()
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
    cell: ({ row }) => (
      <BrandsDataTableRowActions row={row} />
    ),
    size: 32,
    meta: {
      className: cn(
        "bg-background max-md:sticky end-0 z-10 rounded-tr-[inherit]"
      ),
    },
  },
]
