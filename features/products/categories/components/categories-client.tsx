"use client"

import { CategoriesDialogs } from "./categories-dialogs"
import { CategoriesPrimaryButtons } from "./categories-primary-buttons"
import { CategoriesProvider } from "./categories-provider"
import { CategoriesTable } from "./categories-table"

export function CategoriesClient() {
  return (
    <CategoriesProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">
              Manage your product categories and hierarchy here.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <CategoriesTable />
      </div>
      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
