"use client"

import * as React from "react"
import { useDialogState } from "@/hooks/use-dialog-state"

import type { Tax } from "../types"

export type TaxesDialogType =
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "import"
  | "export"

type TaxesContextValue = {
  open: TaxesDialogType | null
  setOpen: (type: TaxesDialogType | null) => void
  currentRow: Tax | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tax | null>>
}

const TaxesContext = React.createContext<TaxesContextValue | null>(null)

export function TaxesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TaxesDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Tax | null>(null)

  return (
    <TaxesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TaxesContext.Provider>
  )
}

export function useTaxesContext() {
  const ctx = React.useContext(TaxesContext)
  if (!ctx) {
    throw new Error("useTaxesContext must be used within TaxesProvider")
  }
  return ctx
}
