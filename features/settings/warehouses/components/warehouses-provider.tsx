"use client"

import * as React from "react"
import { useDialogState } from "@/hooks/use-dialog-state"

import type { Warehouse } from "../types"

export type WarehousesDialogType =
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "import"
  | "export"

type WarehousesContextValue = {
  open: WarehousesDialogType | null
  setOpen: (type: WarehousesDialogType | null) => void
  currentRow: Warehouse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Warehouse | null>>
}

const WarehousesContext = React.createContext<WarehousesContextValue | null>(null)

export function WarehousesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<WarehousesDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Warehouse | null>(null)

  return (
    <WarehousesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </WarehousesContext.Provider>
  )
}

export function useWarehousesContext() {
  const ctx = React.useContext(WarehousesContext)
  if (!ctx) {
    throw new Error("useWarehousesContext must be used within WarehousesProvider")
  }
  return ctx
}
