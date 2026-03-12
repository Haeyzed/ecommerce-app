"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { fonts, type Font } from "@/config/fonts"
import { getCookie, removeCookie, setCookie } from "@/lib/cookies"

const FONT_COOKIE = "font"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type FontContextType = {
  font: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType | null>(null)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<Font>(() => {
    const saved = getCookie(FONT_COOKIE)
    return fonts.includes(saved as Font) ? (saved as Font) : fonts[0]
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.forEach((cls) => {
      if (cls.startsWith("font-")) root.classList.remove(cls)
    })
    root.classList.add("font-" + font)
  }, [font])

  const setFont = (f: Font) => {
    setCookie(FONT_COOKIE, f, COOKIE_MAX_AGE)
    setFontState(f)
  }
  const resetFont = () => {
    removeCookie(FONT_COOKIE)
    setFontState(fonts[0])
  }

  return (
    <FontContext.Provider value={{ font, setFont, resetFont }}>
      {children}
    </FontContext.Provider>
  )
}

export function useFont() {
  const ctx = useContext(FontContext)
  if (!ctx) throw new Error("useFont must be used within FontProvider")
  return ctx
}
