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
import { IconDir } from "@/assets/custom/icon-dir"
import { IconLayoutCompact } from "@/assets/custom/icon-layout-compact"
import { IconLayoutDefault } from "@/assets/custom/icon-layout-default"
import { IconLayoutFull } from "@/assets/custom/icon-layout-full"
import { IconSidebarFloating } from "@/assets/custom/icon-sidebar-floating"
import { IconSidebarInset } from "@/assets/custom/icon-sidebar-inset"
import { IconSidebarSidebar } from "@/assets/custom/icon-sidebar-sidebar"
import { IconThemeDark } from "@/assets/custom/icon-theme-dark"
import { IconThemeLight } from "@/assets/custom/icon-theme-light"
import { IconThemeSystem } from "@/assets/custom/icon-theme-system"
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

function IconDirLtr(props: SVGProps<SVGSVGElement>) {
  return <IconDir dir="ltr" {...props} />
}
function IconDirRtl(props: SVGProps<SVGSVGElement>) {
  return <IconDir dir="rtl" {...props} />
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
          { value: "system", label: "System", icon: IconThemeSystem },
          { value: "light", label: "Light", icon: IconThemeLight },
          { value: "dark", label: "Dark", icon: IconThemeDark },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} isTheme currentValue={theme ?? defaultTheme} />
        ))}
      </RadioGroup>
    </div>
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
          { value: "inset", label: "Inset", icon: IconSidebarInset },
          { value: "floating", label: "Floating", icon: IconSidebarFloating },
          { value: "sidebar", label: "Sidebar", icon: IconSidebarSidebar },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} currentValue={variant} />
        ))}
      </RadioGroup>
    </div>
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
          { value: "default", label: "Default", icon: IconLayoutDefault },
          { value: "icon", label: "Compact", icon: IconLayoutCompact },
          { value: "offcanvas", label: "Overlay", icon: IconLayoutFull },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} currentValue={radioState} />
        ))}
      </RadioGroup>
    </div>
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
          { value: "ltr", label: "LTR", icon: IconDirLtr },
          { value: "rtl", label: "RTL", icon: IconDirRtl },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} currentValue={dir} />
        ))}
      </RadioGroup>
    </div>
  )
}
