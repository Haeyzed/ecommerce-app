"use client"

import * as React from "react"
import { useDialogState } from "@/hooks/use-dialog-state"
import type { Brand } from "../types"

export type BrandsDialogType =
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "import"
  | "export"

type BrandsContextValue = {
  open: BrandsDialogType | null
  setOpen: (type: BrandsDialogType | null) => void
  currentRow: Brand | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Brand | null>>
}

const BrandsContext = React.createContext<BrandsContextValue | null>(null)

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BrandsDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Brand | null>(null)

  return (
    <BrandsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </BrandsContext.Provider>
  )
}

export function useBrandsContext() {
  const ctx = React.useContext(BrandsContext)
  if (!ctx) {
    throw new Error("useBrandsContext must be used within BrandsProvider")
  }
  return ctx
}
