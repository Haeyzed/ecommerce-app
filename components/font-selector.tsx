"use client"

import type React from "react"
import { fonts, fontLabels, type Font } from "@/config/fonts"
import { useFont } from "@/lib/providers/font-provider"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FontSelector({ className }: React.ComponentProps<"div">) {
  const { font, setFont } = useFont()

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label
        htmlFor="font-selector"
        className="text-sm font-medium text-muted-foreground"
      >
        Font
      </Label>
      <Select value={font} onValueChange={(v) => setFont(v as Font)}>
        <SelectTrigger
          id="font-selector"
          className="h-9 w-full border-secondary bg-secondary px-3 text-secondary-foreground shadow-none"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-medium text-muted-foreground/70">Aa</span>
            <SelectValue placeholder="Select font" />
          </div>
        </SelectTrigger>
        <SelectContent align="end" className="max-h-[300px]">
          {fonts.map((f) => (
            <SelectItem key={f} value={f} className="cursor-pointer">
              <span className="text-sm">{fontLabels[f] ?? f}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
