"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { Building2, CheckCircle2, XCircle } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { isActiveOptions } from "../constants"
import type { Warehouse } from "../types"
import { WarehousesDataTableRowActions } from "./warehouses-data-table-row-actions"
import { LongText } from "@/components/long-text"

export const warehousesColumns: ColumnDef<Warehouse>[] = [
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
        className="translate-y-0.5"
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
        className="translate-y-0.5"
      />
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Warehouse> }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.original.name}</LongText>
    ),
    meta: {
      label: "Name",
      placeholder: "Search warehouses...",
      variant: "text",
      icon: Building2,
      className: cn(
        "bg-background drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky max-md:start-10 @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableColumnFilter: true,
  },
  {
    id: "phone_number",
    accessorKey: "phone_number",
    header: ({ column }: { column: Column<Warehouse> }) => (
      <DataTableColumnHeader column={column} label="Phone Number" />
    ),
    cell: ({ cell }) => (
      <div className="text-muted-foreground">
        {cell.getValue<Warehouse["phone_number"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }: { column: Column<Warehouse> }) => (
      <DataTableColumnHeader column={column} label="Email" />
    ),
    cell: ({ cell }) => (
      <div className="text-muted-foreground">
        {cell.getValue<Warehouse["email"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "address",
    accessorKey: "address",
    header: ({ column }: { column: Column<Warehouse> }) => (
      <DataTableColumnHeader column={column} label="Address" />
    ),
    cell: ({ cell }) => (
      <div className="max-w-55 truncate text-muted-foreground">
        {cell.getValue<Warehouse["address"]>() ?? "-"}
      </div>
    ),
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: ({ column }: { column: Column<Warehouse> }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<Warehouse["is_active"]>()
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
    header: ({ column }: { column: Column<Warehouse> }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<Warehouse["created_at"]>()
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
    cell: ({ row }) => <WarehousesDataTableRowActions row={row} />,
    size: 32,
    meta: {
      className: cn(
        "end-0 z-10 rounded-tr-[inherit] bg-background max-md:sticky"
      ),
    },
  },
]
