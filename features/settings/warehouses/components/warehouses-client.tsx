"use client"

import { WarehousesDialogs } from "./warehouses-dialogs"
import { WarehousesPrimaryButtons } from "./warehouses-primary-buttons"
import { WarehousesProvider } from "./warehouses-provider"
import { WarehousesTable } from "./warehouses-table"

export function WarehousesClient() {
  return (
    <WarehousesProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Warehouses</h2>
            <p className="text-muted-foreground">
              Manage your warehouses and contact details here.
            </p>
          </div>
          <WarehousesPrimaryButtons />
        </div>
        <WarehousesTable />
      </div>
      <WarehousesDialogs />
    </WarehousesProvider>
  )
}
