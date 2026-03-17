"use client"

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"

import { useProducts } from "../api"
import type { Product } from "../types"

import { getProductsColumns } from "./products-columns"
import { ProductsDataTableBulkActions } from "./products-data-table-bulk-actions"
import { useOptionCategories } from "../../categories"
import { useOptionBrands } from "../../brands"
import { useOptionUnits } from "../../units"

export function ProductsTable() {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [featured] = useQueryState(
    "featured",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [type] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [brandId] = useQueryState(
    "brand_id",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [categoryId] = useQueryState(
    "category_id",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [unitId] = useQueryState(
    "unit_id",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [stockFilter] = useQueryState("stock_filter", parseAsString.withDefault(""))

  const [startDate] = useQueryState("start_date", parseAsString.withDefault(""))
  const [endDate] = useQueryState("end_date", parseAsString.withDefault(""))

  const apiParams = React.useMemo(
    () => ({
      page,
      per_page: perPage,
      search: name === "" ? undefined : name,
      is_active:
        isActive.length > 0
          ? isActive.map((v) => v === "1")
          : undefined,
      featured:
        featured.length > 0
          ? featured.map((v) => v === "1")
          : undefined,
      type: type.length > 0 ? type : undefined,
      brand_id: brandId.length > 0 ? brandId.map(Number) : undefined,
      category_id: categoryId.length > 0 ? categoryId.map(Number) : undefined,
      unit_id: unitId.length > 0 ? unitId.map(Number) : undefined,
      stock_filter: stockFilter === "" ? undefined : (stockFilter as any),
      start_date: startDate === "" ? undefined : startDate,
      end_date: endDate === "" ? undefined : endDate,
    }),
    [page, perPage, name, isActive, featured, type, brandId, categoryId, unitId, stockFilter, startDate, endDate]
  )

  const {
    data: apiData,
    meta,
    isLoading,
    isError,
    error,
  } = useProducts(apiParams)

  // Fetch the options for the column filters
  const { data: categories = [] } = useOptionCategories()
  const { data: brands = [] } = useOptionBrands()
  const { data: units = [] } = useOptionUnits()

  const products: Product[] = apiData ?? []

  const pageCount = React.useMemo(() => {
    if (!meta) return 0
    return meta.last_page
  }, [meta])

  const columns = React.useMemo(
    () => getProductsColumns({ categories, brands, units }),
    [categories, brands, units]
  )

  const { table } = useDataTable<Product>({
    data: products,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (isLoading) {
    return (
      <div className="data-table-container">
        <DataTableSkeleton
          columnCount={columns.length}
          rowCount={10}
          filterCount={6}
          cellWidths={["2rem", "auto", "6rem", "6rem", "6rem", "6rem", "6rem", "6rem", "6rem", "7rem", "2rem"]}
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="data-table-container flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">
          Failed to load products
        </p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    )
  }

  return (
    <div className="data-table-container flex flex-1 flex-col gap-4 max-sm:has-[div[role='toolbar']]:mb-16">
      <DataTable
        table={table}
        actionBar={<ProductsDataTableBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}