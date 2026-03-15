"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { isActiveOptions } from "../constants"
import type { Unit } from "../types"
import { UnitsDataTableRowActions } from "./units-data-table-row-actions"

export const unitsColumns: ColumnDef<Unit>[] = [
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
    header: ({ column }: { column: Column<Unit, unknown> }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3 ps-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
          <span className="text-xs font-medium">
            {row.original.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="max-w-36 truncate">{row.original.name}</span>
      </div>
    ),
  },
  {
    id: "code",
    accessorKey: "code",
    header: ({ column }: { column: Column<Unit, unknown> }) => (
      <DataTableColumnHeader column={column} label="Code" />
    ),
    cell: ({ cell }) => (
      <div className="text-muted-foreground">
        {cell.getValue<Unit["code"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "base_unit",
    accessorKey: "base_unit_relation.name",
    header: ({ column }: { column: Column<Unit, unknown> }) => (
      <DataTableColumnHeader column={column} label="Base Unit" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.base_unit_relation?.name ?? "-"}
      </div>
    ),
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: ({ column }: { column: Column<Unit, unknown> }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<Unit["is_active"]>()
      return (
        <Badge variant="outline" className="capitalize">
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: isActiveOptions,
    },
    enableColumnFilter: true,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }: { column: Column<Unit, unknown> }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<Unit["created_at"]>()
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
    cell: ({ row }) => <UnitsDataTableRowActions row={row} />,
    size: 32,
    meta: {
      className: cn(
        "end-0 z-10 rounded-tr-[inherit] bg-background max-md:sticky"
      ),
    },
  },
]

