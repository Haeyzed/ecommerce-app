"use client"

import { UnitsDialogs } from "./units-dialogs"
import { UnitsPrimaryButtons } from "./units-primary-buttons"
import { UnitsProvider } from "./units-provider"
import { UnitsTable } from "./units-table"

export function UnitsClient() {
  return (
    <UnitsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Units</h2>
            <p className="text-muted-foreground">
              Manage your measurement units and conversion factors here.
            </p>
          </div>
          <UnitsPrimaryButtons />
        </div>
        <UnitsTable />
      </div>
      <UnitsDialogs />
    </UnitsProvider>
  )
}
