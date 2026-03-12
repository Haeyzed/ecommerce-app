"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { getCookie, removeCookie, setCookie } from "@/lib/cookies"
import { type ThemeName } from "@/lib/themes"

const ACTIVE_THEME_COOKIE = "active-theme"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const DEFAULT_THEME: ThemeName = "neutral"

type ActiveThemeContextType = {
  activeTheme: ThemeName
  setActiveTheme: (theme: ThemeName) => void
  resetTheme: () => void
}

const ActiveThemeContext = createContext<ActiveThemeContextType | undefined>(
  undefined
)

export function ActiveThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = ACTIVE_THEME_COOKIE,
}: {
  children: ReactNode
  defaultTheme?: ThemeName
  storageKey?: string
}) {
  const [activeTheme, setActiveThemeState] = useState<ThemeName>(
    () => (getCookie(storageKey) as ThemeName) || defaultTheme
  )

  useEffect(() => {
    const body = document.body
    Array.from(body.classList)
      .filter((c) => c.startsWith("theme-"))
      .forEach((c) => body.classList.remove(c))
    body.classList.add("theme-" + activeTheme)
  }, [activeTheme])

  const setActiveTheme = (theme: ThemeName) => {
    setCookie(storageKey, theme, COOKIE_MAX_AGE)
    setActiveThemeState(theme)
  }
  const resetTheme = () => {
    removeCookie(storageKey)
    setActiveThemeState(defaultTheme)
  }

  return (
    <ActiveThemeContext.Provider
      value={{ activeTheme, setActiveTheme, resetTheme }}
    >
      {children}
    </ActiveThemeContext.Provider>
  )
}

export function useThemeConfig() {
  const ctx = useContext(ActiveThemeContext)
  if (ctx === undefined)
    throw new Error("useThemeConfig must be used within ActiveThemeProvider")
  return ctx
}
