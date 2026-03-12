"use client"

import * as React from "react"
import { type SVGProps } from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
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
import { RadioGroup } from "@/components/ui/radio-group"
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

/** Config option row: Radix Item with bordered box and icon, matching ecommerce-frontend config-drawer UI */
function ConfigRadioItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
}) {
  return (
    <RadioGroupPrimitive.Item
      value={item.value}
      className={cn("group outline-none", "transition duration-200 ease-in")}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          "relative rounded-[6px] ring-[1px] ring-border",
          "group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring"
        )}
        role="img"
        aria-hidden
        aria-label={`${item.label} option preview`}
      >
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          className={cn(
            "size-6 fill-primary stroke-white",
            "group-data-[state=unchecked]:hidden",
            "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
          )}
          aria-hidden
        />
        <div className="p-2">
          <item.icon
            className={cn(
              "size-8",
              !isTheme &&
                "fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground"
            )}
          />
        </div>
      </div>
      <div
        className="mt-1 text-xs"
        id={`${item.value}-description`}
        aria-live="polite"
      >
        {item.label}
      </div>
    </RadioGroupPrimitive.Item>
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
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription id="config-drawer-description">
            Adjust the appearance and layout to suit your preferences.
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
            aria-label="Reset all settings to default values"
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
  const [clickEvent, setClickEvent] = React.useState<React.MouseEvent | null>(null)

  const handleThemeChange = (newTheme: string) => {
    const root = document.documentElement

    if (typeof document.startViewTransition !== "function") {
      setTheme(newTheme as "light" | "dark" | "system")
      return
    }

    if (clickEvent) {
      root.style.setProperty("--x", `${clickEvent.clientX}px`)
      root.style.setProperty("--y", `${clickEvent.clientY}px`)
    }

    document.startViewTransition(() => {
      setTheme(newTheme as "light" | "dark" | "system")
    })

    setClickEvent(null)
  }

  return (
    <div>
      <SectionTitle
        title="Theme"
        showReset={theme !== defaultTheme}
        onReset={() => {
          if (typeof document.startViewTransition === "function") {
            document.startViewTransition(() => setTheme(defaultTheme))
          } else {
            setTheme(defaultTheme)
          }
        }}
      />
      <div
        onClick={(e) => setClickEvent(e)}
        onMouseDown={(e) => setClickEvent(e)}
      >
        <RadioGroup
          value={theme ?? defaultTheme}
          onValueChange={handleThemeChange}
          className="grid w-full max-w-md grid-cols-3 gap-4"
          aria-label="Select theme preference"
          aria-describedby="theme-description"
        >
          {[
            { value: "system", label: "System", icon: IconThemeSystem },
            { value: "light", label: "Light", icon: IconThemeLight },
            { value: "dark", label: "Dark", icon: IconThemeDark },
          ].map((item) => (
            <ConfigRadioItem key={item.value} item={item} isTheme />
          ))}
        </RadioGroup>
      </div>
      <div id="theme-description" className="sr-only">
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}

function ColorThemeConfig() {
  return (
    <div>
      <SectionTitle title="Color Theme" />
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
        aria-describedby="sidebar-description"
      >
        {[
          { value: "inset", label: "Inset", icon: IconSidebarInset },
          { value: "floating", label: "Floating", icon: IconSidebarFloating },
          { value: "sidebar", label: "Sidebar", icon: IconSidebarSidebar },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} />
        ))}
      </RadioGroup>
      <div id="sidebar-description" className="sr-only">
        Choose between inset, floating, or standard sidebar layout
      </div>
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
        aria-label="Select layout style"
        aria-describedby="layout-description"
      >
        {[
          { value: "default", label: "Default", icon: IconLayoutDefault },
          { value: "icon", label: "Compact", icon: IconLayoutCompact },
          { value: "offcanvas", label: "Full layout", icon: IconLayoutFull },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} />
        ))}
      </RadioGroup>
      <div id="layout-description" className="sr-only">
        Choose between default expanded, compact icon-only, or full layout mode
      </div>
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
        aria-label="Select site direction"
        aria-describedby="direction-description"
      >
        {[
          { value: "ltr", label: "Left to Right", icon: IconDirLtr },
          { value: "rtl", label: "Right to Left", icon: IconDirRtl },
        ].map((item) => (
          <ConfigRadioItem key={item.value} item={item} />
        ))}
      </RadioGroup>
      <div id="direction-description" className="sr-only">
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  )
}
