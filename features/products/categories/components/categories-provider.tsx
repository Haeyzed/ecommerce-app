"use client"

import * as React from "react"
import { useDialogState } from "@/hooks/use-dialog-state"
import type { Category } from "../types"

export type CategoriesDialogType =
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "import"
  | "export"

type CategoriesContextValue = {
  open: CategoriesDialogType | null
  setOpen: (type: CategoriesDialogType | null) => void
  currentRow: Category | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(
  null
)

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Category | null>(null)

  return (
    <CategoriesContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategoriesContext() {
  const ctx = React.useContext(CategoriesContext)
  if (!ctx) {
    throw new Error(
      "useCategoriesContext must be used within CategoriesProvider"
    )
  }
  return ctx
}
