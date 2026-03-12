"use client"

import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"

import { useBrands } from "../api"
import type { Brand, BrandApi } from "../types"

import { brandsColumns } from "./brands-columns"
import { BrandsDateRangeFilter } from "./brands-date-range-filter"

function mapApiToBrand(b: BrandApi): Brand {
  return {
    id: String(b.id),
    name: b.name,
    slug: b.slug,
    short_description: b.short_description,
    is_active: b.is_active,
    created_at: b.created_at ?? null,
  }
}

export function BrandsTable() {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [startDate] = useQueryState("start_date", parseAsString.withDefault(""))
  const [endDate] = useQueryState("end_date", parseAsString.withDefault(""))

  const apiParams = React.useMemo(
    () => ({
      page,
      per_page: perPage,
      search: name === "" ? undefined : name,
      is_active:
        isActive.length === 1
          ? isActive[0] === "true"
          : undefined,
      start_date: startDate === "" ? undefined : startDate,
      end_date: endDate === "" ? undefined : endDate,
    }),
    [page, perPage, name, isActive, startDate, endDate]
  )

  const { data: apiData, meta, isLoading, isError, error } = useBrands(apiParams)

  const brands: Brand[] = React.useMemo(() => {
    const list = apiData ?? []
    return list.map(mapApiToBrand)
  }, [apiData])

  const pageCount = React.useMemo(() => {
    if (!meta) return 0
    return meta.last_page
  }, [meta])

  const { table } = useDataTable<Brand>({
    data: brands,
    columns: brandsColumns,
    pageCount,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (isLoading) {
    return (
      <div className="data-table-container">
        <DataTableSkeleton
          columnCount={brandsColumns.length}
          rowCount={10}
          filterCount={4}
          cellWidths={["2rem", "auto", "8rem", "12rem", "6rem", "7rem", "2rem"]}
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="data-table-container flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">Failed to load brands</p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    )
  }

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
