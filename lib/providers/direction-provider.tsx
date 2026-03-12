"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Direction } from "radix-ui"
import { getCookie, removeCookie, setCookie } from "@/lib/cookies"

export type Dir = "ltr" | "rtl"
const DIR_COOKIE = "dir"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const DEFAULT_DIR: Dir = "ltr"

type DirectionContextType = {
  defaultDir: Dir
  dir: Dir
  setDir: (dir: Dir) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextType | null>(null)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, setDirState] = useState<Dir>(
    () => (getCookie(DIR_COOKIE) as Dir) || DEFAULT_DIR
  )

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir)
  }, [dir])

  const setDir = (d: Dir) => {
    setDirState(d)
    setCookie(DIR_COOKIE, d, COOKIE_MAX_AGE)
  }
  const resetDir = () => {
    removeCookie(DIR_COOKIE)
    setDirState(DEFAULT_DIR)
  }

  return (
    <DirectionContext.Provider
      value={{ defaultDir: DEFAULT_DIR, dir, setDir, resetDir }}
    >
      <Direction.DirectionProvider dir={dir}>{children}</Direction.DirectionProvider>
    </DirectionContext.Provider>
  )
}

export function useDirection() {
  const ctx = useContext(DirectionContext)
  if (!ctx)
    throw new Error("useDirection must be used within DirectionProvider")
  return ctx
}
