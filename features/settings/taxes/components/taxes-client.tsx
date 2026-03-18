"use client"

import { TaxesDialogs } from "./taxes-dialogs"
import { TaxesPrimaryButtons } from "./taxes-primary-buttons"
import { TaxesProvider } from "./taxes-provider"
import { TaxesTable } from "./taxes-table"

export function TaxesClient() {
  return (
    <TaxesProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Taxes</h2>
            <p className="text-muted-foreground">
              Manage your tax rates and settings here.
            </p>
          </div>
          <TaxesPrimaryButtons />
        </div>
        <TaxesTable />
      </div>
      <TaxesDialogs />
    </TaxesProvider>
  )
}
