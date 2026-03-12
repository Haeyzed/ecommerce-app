"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, MoreHorizontal, Text, XCircle } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { isActiveOptions } from "../constants"
import type { Brand } from "../types"

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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: cn(
        "bg-background max-md:sticky start-0 z-10 rounded-tl-[inherit]"
      ),
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ cell }) => (
      <div className="font-medium">{cell.getValue<Brand["name"]>()}</div>
    ),
    meta: {
      label: "Name",
      placeholder: "Search names...",
      variant: "text",
      icon: Text,
      className: cn(
        "bg-background drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-10 @4xl/content:table-cell @4xl/content:drop-shadow-none"
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
    cell: function Cell() {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 32,
    meta: {
      className: cn(
        "bg-background max-md:sticky end-0 z-10 rounded-tr-[inherit]"
      ),
    },
  },
]
