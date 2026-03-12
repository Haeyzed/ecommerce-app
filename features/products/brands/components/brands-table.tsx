"use client"

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"

import { useBrands } from "../api"
import type { Brand, BrandApi } from "../types"

import { brandsColumns } from "./brands-columns"

function mapApiToBrand(b: BrandApi): Brand {
  return {
    id: String(b.id),
    name: b.name,
    slug: b.slug,
    short_description: b.short_description,
    is_active: b.is_active,
    active_status: b.active_status,
  }
}

export function BrandsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const { data: apiData, isLoading, isError, error } = useBrands()

  const brands: Brand[] = React.useMemo(() => {
    const list = apiData ?? []
    return list.map(mapApiToBrand)
  }, [apiData])

  const filteredData = React.useMemo(() => {
    return brands.filter((brand) => {
      const matchesName =
        name === "" ||
        brand.name.toLowerCase().includes(name.toLowerCase())
      const matchesStatus =
        status.length === 0 || status.includes(brand.active_status)
      return matchesName && matchesStatus
    })
  }, [brands, name, status])

  const { table } = useDataTable<Brand>({
    data: filteredData,
    columns: brandsColumns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  })

  if (isLoading) {
    return (
      <div className="data-table-container flex min-h-[200px] items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">Loading brands…</p>
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
