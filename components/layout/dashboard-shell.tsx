"use client"

import { getCookie } from "@/lib/cookies"
import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./app-sidebar"
import { Header } from "./header"

import { ConfigDrawer } from "@/components/config-drawer"
import { ThemeSwitch } from "@/components/theme-switch"
import { SearchTrigger } from "@/components/search-trigger"

type DashboardShellProps = {
  children: React.ReactNode
  /** Optional greeting text (e.g. "Welcome, {name}") */
  greeting?: React.ReactNode
}

export function DashboardShell({ children, greeting }: DashboardShellProps) {
  const defaultOpen = getCookie("sidebar_state") !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset
        className={cn(
          "@container/content",
          "has-data-[layout=fixed]:h-svh",
          "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]"
        )}
      >
        <Header fixed>
          {greeting}
          <div className="ms-auto flex items-center gap-2">
            <SearchTrigger />
            <ThemeSwitch />
            <ConfigDrawer />
          </div>
        </Header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
