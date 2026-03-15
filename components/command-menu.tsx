"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ArrowRight01Icon,
  ArrowRight02Icon,
  LaptopIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSearch } from "@/lib/providers/search-provider"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { sidebarData } from "@/components/layout/data/sidebar-data"
import type {
  LayoutNavLink,
  LayoutNavCollapsible,
} from "@/components/layout/types"

function isNavLink(
  item: LayoutNavLink | LayoutNavCollapsible
): item is LayoutNavLink {
  return "url" in item && item.url != null
}

export function CommandMenu() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="max-h-[300px]">
          <ScrollArea className="h-72 pe-1">
            <div className="p-1">
              <CommandEmpty>No results found.</CommandEmpty>
              {sidebarData.navGroups.map((group) => (
                <CommandGroup key={group.title} heading={group.title}>
                  {group.items.map((navItem, i) => {
                    if (isNavLink(navItem))
                      return (
                        <CommandItem
                          key={`${navItem.url}-${i}`}
                          value={navItem.title}
                          onSelect={() =>
                            runCommand(() => router.push(navItem.url))
                          }
                        >
                          <div className="flex size-4 items-center justify-center">
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              className="size-2 text-muted-foreground/80"
                              strokeWidth={2}
                            />
                          </div>
                          {navItem.title}
                        </CommandItem>
                      )
                    return (navItem as LayoutNavCollapsible).items?.map(
                      (subItem, j) => (
                        <CommandItem
                          key={`${navItem.title}-${subItem.url}-${j}`}
                          value={`${navItem.title} ${subItem.title}`}
                          onSelect={() =>
                            runCommand(() => router.push(subItem.url))
                          }
                        >
                          <div className="flex size-4 items-center justify-center">
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              className="size-2 text-muted-foreground/80"
                              strokeWidth={2}
                            />
                          </div>
                          {navItem.title}
                          <HugeiconsIcon
                            icon={ArrowRight02Icon}
                            className="size-4 text-muted-foreground"
                            strokeWidth={2}
                          />
                          {subItem.title}
                        </CommandItem>
                      )
                    )
                  })}
                </CommandGroup>
              ))}
              <CommandSeparator />
              <CommandGroup heading="Theme">
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("light"))}
                >
                  <HugeiconsIcon
                    icon={Sun03Icon}
                    strokeWidth={2}
                    className="mr-2 size-4"
                  />
                  <span>Light</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("dark"))}
                >
                  <HugeiconsIcon
                    icon={Moon02Icon}
                    strokeWidth={2}
                    className="mr-2 size-4 scale-90"
                  />
                  <span>Dark</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("system"))}
                >
                  <HugeiconsIcon
                    icon={LaptopIcon}
                    strokeWidth={2}
                    className="mr-2 size-4"
                  />
                  <span>System</span>
                </CommandItem>
              </CommandGroup>
            </div>
          </ScrollArea>
        </CommandList>
        <div className="flex items-center justify-end gap-1.5 border-t px-2 py-1.5 text-xs text-muted-foreground">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <span>to open</span>
        </div>
      </Command>
    </CommandDialog>
  )
}
