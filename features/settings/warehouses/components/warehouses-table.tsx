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

import { useWarehouses } from "../api"
import type { Warehouse } from "../types"

import { warehousesColumns } from "./warehouses-columns"
import { WarehousesDataTableBulkActions } from "./warehouses-data-table-bulk-actions"

export function WarehousesTable() {
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
        isActive.length > 0
          ? (isActive.map((v) => (v === "1" ? 1 : 0)) as (0 | 1)[])
          : undefined,
      start_date: startDate === "" ? undefined : startDate,
      end_date: endDate === "" ? undefined : endDate,
    }),
    [page, perPage, name, isActive, startDate, endDate]
  )

  const {
    data: apiData,
    meta,
    isLoading,
    isError,
    error,
  } = useWarehouses(apiParams)

  const warehouses: Warehouse[] = apiData ?? []

  const pageCount = React.useMemo(() => {
    if (!meta) return 0
    return meta.last_page
  }, [meta])

  const { table } = useDataTable<Warehouse>({
    data: warehouses,
    columns: warehousesColumns,
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
          columnCount={warehousesColumns.length}
          rowCount={10}
          filterCount={4}
          cellWidths={["2rem", "auto", "10rem", "14rem", "16rem", "7rem", "7rem", "2rem"]}
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="data-table-container flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">
          Failed to load warehouses
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
        actionBar={<WarehousesDataTableBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
