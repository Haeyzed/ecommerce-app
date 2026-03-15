"use client"

import { UnitsDialogs } from "./units-dialogs"
import { UnitsPrimaryButtons } from "./units-primary-buttons"
import { UnitsProvider } from "./units-provider"
import { UnitsTable } from "./units-table"

export function UnitsClient() {
  return (
    <UnitsProvider>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold tracking-tight">Units</h1>
          <UnitsPrimaryButtons />
        </div>
        <UnitsTable />
      </div>
      <UnitsDialogs />
    </UnitsProvider>
  )
}

