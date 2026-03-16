"use client"

import { ProductsDialogs } from "./products-dialogs"
import { ProductsPrimaryButtons } from "./products-primary-buttons"
import { ProductsProvider } from "./products-provider"
import { ProductsTable } from "./products-table"

export function ProductsClient() {
  return (
    <ProductsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">
              Manage your products and their visibility here.
            </p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable />
      </div>
      <ProductsDialogs />
    </ProductsProvider>
  )
}
