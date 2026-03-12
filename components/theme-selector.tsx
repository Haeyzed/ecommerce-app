"use client"

import type React from "react"
import { useThemeConfig } from "@/lib/providers/active-theme-provider"
import { themeColors } from "@/lib/theme-colors"
import { THEMES } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ThemeSelector({ className }: React.ComponentProps<"div">) {
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const value = activeTheme ?? "neutral"
  const activeColor = themeColors[value]?.color

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label
        htmlFor="theme-selector"
        className="text-sm font-medium text-muted-foreground"
      >
        Color theme
      </Label>
      <Select value={value} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          className="h-9 w-full border-secondary bg-secondary px-3 text-secondary-foreground shadow-none"
        >
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent align="end" className="max-h-[300px]">
          {THEMES.map((t) => {
            const themeColor = themeColors[t.name]
            return (
              <SelectItem
                key={t.name}
                value={t.name}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 shrink-0 rounded-full border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: themeColor?.color }}
                  />
                  <span>{t.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
