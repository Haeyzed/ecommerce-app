"use client"

import { useCallback, useEffect } from "react"
import { useTheme } from "next-themes"
import { Checkmark, Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const themeColor = resolvedTheme === "dark" ? "#020817" : "#fff"
    const meta = document.querySelector("meta[name='theme-color']")
    if (meta) meta.setAttribute("content", themeColor)
  }, [resolvedTheme])

  const handleThemeChange = useCallback(
    (newTheme: "light" | "dark" | "system", e?: React.MouseEvent) => {
      const root = document.documentElement

      if (typeof document.startViewTransition !== "function") {
        setTheme(newTheme)
        return
      }

      if (e) {
        root.style.setProperty("--x", `${e.clientX}px`)
        root.style.setProperty("--y", `${e.clientY}px`)
      }

      document.startViewTransition(() => {
        setTheme(newTheme)
      })
    },
    [setTheme]
  )

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative scale-95 rounded-full"
          aria-label="Toggle theme"
        >
          <HugeiconsIcon
            icon={Sun02Icon}
            className="size-[1.2rem] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90 dark:opacity-0"
          />
          <HugeiconsIcon
            icon={Moon02Icon}
            className="absolute inset-0 m-auto size-[1.2rem] scale-0 rotate-90 opacity-0 transition-all duration-300 dark:scale-100 dark:rotate-0 dark:opacity-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => handleThemeChange("light", e)}>
          Light
          <HugeiconsIcon
            icon={Checkmark}
            className={cn("ms-auto size-3.5", theme !== "light" && "hidden")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleThemeChange("dark", e)}>
          Dark
          <HugeiconsIcon
            icon={Checkmark}
            className={cn("ms-auto size-3.5", theme !== "dark" && "hidden")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleThemeChange("system", e)}>
          System
          <HugeiconsIcon
            icon={Checkmark}
            className={cn("ms-auto size-3.5", theme !== "system" && "hidden")}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
