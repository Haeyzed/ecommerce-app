"use client"

import * as React from "react"
import { type SVGProps } from "react"
import {
  CheckmarkCircle02Icon,
  Rotate01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"
import { useThemeConfig } from "@/lib/providers/active-theme-provider"
import { useDirection } from "@/lib/providers/direction-provider"
import { useFont } from "@/lib/providers/font-provider"
import { type Collapsible, useLayout } from "@/lib/providers/layout-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FontSelector } from "@/components/font-selector"
import { ThemeSelector } from "@/components/theme-selector"
import { useSidebar } from "@/components/ui/sidebar"

function SectionTitle({
  title,
  showReset = false,
  onReset,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground",
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          size="icon"
          variant="secondary"
          className="size-4 rounded-full"
          onClick={onReset}
          aria-label={`Reset ${title.toLowerCase()}`}
        >
          <HugeiconsIcon icon={Rotate01Icon} className="size-3" />
        </Button>
      )}
    </div>
  )
}

function ConfigRadioItem({
  item,
  isTheme = false,
  currentValue,
}: {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
  currentValue?: string
}) {
  const checked = currentValue === item.value
  return (
    <label className="flex cursor-pointer flex-col items-center gap-1 focus-within:ring-2 focus-within:ring-ring rounded-[6px]">
      <div
        className={cn(
          "relative rounded-[6px] ring-[1px] ring-border transition duration-200 ease-in",
          checked && "shadow-2xl ring-primary"
        )}
      >
        <RadioGroupItem
          value={item.value}
          aria-label={`Select ${item.label.toLowerCase()}`}
          className="absolute inset-0 z-10 opacity-0"
        />
        {checked && (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="absolute top-0 right-0 size-6 translate-x-1/2 -translate-y-1/2 fill-primary stroke-white"
          />
        )}
        <div className="p-2">
          <item.icon
            className={cn(
              "size-8",
              !isTheme &&
                (checked
                  ? "fill-primary stroke-primary text-primary"
                  : "fill-muted-foreground stroke-muted-foreground text-muted-foreground")
            )}
          />
        </div>
      </div>
      <span className="text-xs">{item.label}</span>
    </label>
  )
}

// Simple LTR/RTL icons (arrows)
function IconLtr(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 6h16M4 12h10M4 18h16" />
    </svg>
  )
}
function IconRtl(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6H4M14 12H4M20 18H4" />
    </svg>
  )
}

export function ConfigDrawer() {
  const { setOpen } = useSidebar()
  const { resetDir } = useDirection()
  const { setTheme } = useTheme()
  const { resetLayout } = useLayout()
  const { resetFont } = useFont()
  const { resetTheme: resetActiveTheme } = useThemeConfig()

  const handleReset = () => {
    setOpen(true)
    resetDir()
    setTheme("system")
    resetLayout()
    resetFont()
    resetActiveTheme()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Open theme settings"
          aria-describedby="config-drawer-description"
          className="rounded-full"
        >
          <HugeiconsIcon icon={Settings01Icon} className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>Theme settings</SheetTitle>
          <SheetDescription id="config-drawer-description">
            Adjust appearance and layout.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4">
          <ThemeConfig />
          <ColorThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
        <SheetFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={handleReset}
            aria-label="Reset all settings"
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ThemeConfig() {
  const { theme, setTheme } = useTheme()
  const defaultTheme = "system"

  return (
    <div>
      <SectionTitle
        title="Appearance"
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
      />
      <RadioGroup
        value={theme ?? defaultTheme}
        onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select theme"
      >
        {[
          { value: "system", label: "System", icon: LaptopIcon },
          { value: "light", label: "Light", icon: SunIcon },
          { value: "dark", label: "Dark", icon: MoonIcon },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} isTheme currentValue={theme ?? defaultTheme} />
        ))}
      </RadioGroup>
    </div>
  )
}

function LaptopIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M2 18h20" />
    </svg>
  )
}
function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}
function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function ColorThemeConfig() {
  return (
    <div>
      <SectionTitle title="Color theme" />
      <div className="grid grid-cols-2 gap-3">
        <ThemeSelector />
        <FontSelector />
      </div>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Sidebar"
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
      />
      <RadioGroup
        value={variant}
        onValueChange={(v) => setVariant(v as "inset" | "sidebar" | "floating")}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select sidebar style"
      >
        {[
          { value: "inset", label: "Inset", icon: PanelInsetIcon },
          { value: "floating", label: "Floating", icon: PanelFloatingIcon },
          { value: "sidebar", label: "Sidebar", icon: PanelSidebarIcon },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} currentValue={variant} />
        ))}
      </RadioGroup>
    </div>
  )
}

function PanelInsetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 2v20M16 2v20" />
    </svg>
  )
}
function PanelFloatingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="4" width="8" height="16" rx="1" />
      <rect x="14" y="4" width="8" height="16" rx="1" />
    </svg>
  )
}
function PanelSidebarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="8" height="20" rx="1" />
      <rect x="12" y="2" width="10" height="20" rx="1" />
    </svg>
  )
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar()
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()
  const radioState = open ? "default" : collapsible

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Layout"
        showReset={radioState !== "default"}
        onReset={() => {
          setOpen(true)
          setCollapsible(defaultCollapsible)
        }}
      />
      <RadioGroup
        value={radioState}
        onValueChange={(v) => {
          if (v === "default") {
            setOpen(true)
            return
          }
          setOpen(false)
          setCollapsible(v as Collapsible)
        }}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select layout"
      >
        {[
          { value: "default", label: "Default", icon: LayoutDefaultIcon },
          { value: "icon", label: "Compact", icon: LayoutCompactIcon },
          { value: "offcanvas", label: "Overlay", icon: LayoutOverlayIcon },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} currentValue={radioState} />
        ))}
      </RadioGroup>
    </div>
  )
}

function LayoutDefaultIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="7" height="20" rx="1" />
      <rect x="11" y="2" width="11" height="20" rx="1" />
    </svg>
  )
}
function LayoutCompactIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="5" height="20" rx="1" />
      <rect x="9" y="2" width="13" height="20" rx="1" />
    </svg>
  )
}
function LayoutOverlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="1" />
    </svg>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  return (
    <div>
      <SectionTitle
        title="Direction"
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
      />
      <RadioGroup
        value={dir}
        onValueChange={(v) => setDir(v as "ltr" | "rtl")}
        className="grid w-full max-w-md grid-cols-2 gap-4"
        aria-label="Select direction"
      >
        {[
          { value: "ltr", label: "LTR", icon: IconLtr },
          { value: "rtl", label: "RTL", icon: IconRtl },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} currentValue={dir} />
        ))}
      </RadioGroup>
    </div>
  )
}
