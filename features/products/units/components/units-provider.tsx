"use client"

import * as React from "react"
import { useDialogState } from "@/hooks/use-dialog-state"

import type { Unit } from "../types"

export type UnitsDialogType =
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "import"
  | "export"

type UnitsContextValue = {
  open: UnitsDialogType | null
  setOpen: (type: UnitsDialogType | null) => void
  currentRow: Unit | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Unit | null>>
}

const UnitsContext = React.createContext<UnitsContextValue | null>(null)

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UnitsDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Unit | null>(null)

  return (
    <UnitsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnitsContext() {
  const ctx = React.useContext(UnitsContext)
  if (!ctx) {
    throw new Error("useUnitsContext must be used within UnitsProvider")
  }
  return ctx
}
