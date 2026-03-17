"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, MoreHorizontal, Text, XCircle } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import {
  isActiveOptions,
  featuredOptions,
  productTypeOptions,
} from "../constants"
import type { Product } from "../types"
import { ProductTypeEnum } from "../types"
import { ProductsDataTableRowActions } from "./products-data-table-row-actions"
import { LongText } from "@/components/long-text"
import { ImageZoomCell } from "@/components/image-zoom"

export const productsColumns: ColumnDef<Product>[] = [
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
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => {
      const images = row.original.image_urls || []

      return (
        <div className="flex items-center gap-3 ps-3">
          {images.length > 1 ? (
            <Carousel className="w-10 h-10 cursor-grab active:cursor-grabbing">
              <CarouselContent className="ml-0">
                {images.map((url, i) => (
                  <CarouselItem key={i} className="pl-0 basis-full">
                    <ImageZoomCell src={url} alt={`${row.original.name} ${i + 1}`} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : images.length === 1 ? (
            <ImageZoomCell src={images[0]} alt={row.original.name} />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-md bg-muted shrink-0">
              <span className="text-xs font-medium">
                {row.original.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <LongText className="max-w-36 font-medium">{row.original.name}</LongText>
            <span className="text-[10px] text-muted-foreground">{row.original.code}</span>
          </div>
        </div>
      )
    },
    meta: {
      label: "Name",
      placeholder: "Search names & codes...",
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
    id: "type",
    accessorKey: "type",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} label="Type" />
    ),
    cell: ({ cell }) => (
      <Badge variant="secondary" className="capitalize">
        {cell.getValue<Product["type"]>() ?? "-"}
      </Badge>
    ),
    meta: {
      label: "Type",
      variant: "multiSelect",
      options: productTypeOptions.map((o) => ({
        label: o.label,
        value: o.value,
      })),
    },
    enableColumnFilter: true,
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} label="Price" />
    ),
    cell: ({ cell }) => (
      <div className="font-medium">
        ${Number(cell.getValue<Product["price"]>()).toFixed(2)}
      </div>
    ),
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<Product["is_active"]>()
      const Icon = isActive ? CheckCircle2 : XCircle
      return (
        <Badge variant="outline" className="capitalize">
          <Icon className="size-3.5 mr-1" />
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
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} label="Featured" />
    ),
    cell: ({ cell }) => {
      const featured = cell.getValue<Product["featured"]>()
      const Icon = featured ? CheckCircle2 : XCircle
      return (
        <Badge variant="outline" className="capitalize">
          <Icon className="size-3.5 mr-1" />
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
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<Product["created_at"]>()
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
    cell: ({ row }) => <ProductsDataTableRowActions row={row} />,
    size: 32,
    meta: {
      className: cn(
        "end-0 z-10 rounded-tr-[inherit] bg-background max-md:sticky"
      ),
    },
  },
]