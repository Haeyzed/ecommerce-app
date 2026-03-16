"use client"

import * as React from "react"
import { useDialogState } from "@/hooks/use-dialog-state"
import type { Product } from "../types"

export type ProductsDialogType =
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "import"
  | "export"

type ProductsContextValue = {
  open: ProductsDialogType | null
  setOpen: (type: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
}

const ProductsContext = React.createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Product | null>(null)

  return (
    <ProductsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProductsContext() {
  const ctx = React.useContext(ProductsContext)
  if (!ctx) {
    throw new Error("useProductsContext must be used within ProductsProvider")
  }
  return ctx
}
