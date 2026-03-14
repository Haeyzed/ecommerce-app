"use client"

import { BrandsDialogs } from "./brands-dialogs"
import { BrandsPrimaryButtons } from "./brands-primary-buttons"
import { BrandsProvider } from "./brands-provider"
import { BrandsTable } from "./brands-table"

export function BrandsClient() {
  return (
    <BrandsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Brands</h2>
            <p className="text-muted-foreground">
              Manage your brands and their visibility here.
            </p>
          </div>
          <BrandsPrimaryButtons />
        </div>
        <BrandsTable />
      </div>
      <BrandsDialogs />
    </BrandsProvider>
  )
}
