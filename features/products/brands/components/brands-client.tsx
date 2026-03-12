"use client"

import { BrandsTable } from "./brands-table"

export function BrandsClient() {
  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Brands</h2>
        <p className="text-muted-foreground">
          Manage your brands and their visibility here.
        </p>
      </div>
      <BrandsTable />
    </div>
  )
}
