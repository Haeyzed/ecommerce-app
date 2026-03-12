"use client"

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"

import { brandsData } from "../data"
import type { Brand } from "../types"

import { brandsColumns } from "./brands-columns"

export function BrandsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const filteredData = React.useMemo(() => {
    return brandsData.filter((brand) => {
      const matchesName =
        name === "" ||
        brand.name.toLowerCase().includes(name.toLowerCase())
      const matchesStatus =
        status.length === 0 || status.includes(brand.active_status)
      return matchesName && matchesStatus
    })
  }, [name, status])

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

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
