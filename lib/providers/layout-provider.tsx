"use client"

import { createContext, useContext, useState } from "react"
import { getCookie, setCookie } from "@/lib/cookies"

export type Collapsible = "offcanvas" | "icon" | "none"
export type SidebarVariant = "inset" | "sidebar" | "floating"

const LAYOUT_COLLAPSIBLE_COOKIE = "layout_collapsible"
const LAYOUT_VARIANT_COOKIE = "layout_variant"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const DEFAULT_COLLAPSIBLE: Collapsible = "icon"
const DEFAULT_VARIANT: SidebarVariant = "inset"

type LayoutContextType = {
  resetLayout: () => void
  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (v: Collapsible) => void
  defaultVariant: SidebarVariant
  variant: SidebarVariant
  setVariant: (v: SidebarVariant) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsible, setCollapsibleState] = useState<Collapsible>(() => {
    const saved = getCookie(LAYOUT_COLLAPSIBLE_COOKIE)
    return (saved as Collapsible) || DEFAULT_COLLAPSIBLE
  })
  const [variant, setVariantState] = useState<SidebarVariant>(() => {
    const saved = getCookie(LAYOUT_VARIANT_COOKIE)
    return (saved as SidebarVariant) || DEFAULT_VARIANT
  })

  const setCollapsible = (v: Collapsible) => {
    setCollapsibleState(v)
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE, v, COOKIE_MAX_AGE)
  }
  const setVariant = (v: SidebarVariant) => {
    setVariantState(v)
    setCookie(LAYOUT_VARIANT_COOKIE, v, COOKIE_MAX_AGE)
  }
  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setVariant(DEFAULT_VARIANT)
  }

  const value: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
  }

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

export function useLayout() {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider")
  return ctx
}
