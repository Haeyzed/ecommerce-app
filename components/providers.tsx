"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { ActiveThemeProvider } from "@/lib/providers/active-theme-provider"
import { DirectionProvider } from "@/lib/providers/direction-provider"
import { FontProvider } from "@/lib/providers/font-provider"
import { LayoutProvider } from "@/lib/providers/layout-provider"
import { SearchProvider } from "@/lib/providers/search-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NuqsAdapter>
            <ActiveThemeProvider>
              <FontProvider>
                <DirectionProvider>
                  <LayoutProvider>
                    <SearchProvider>
                      <TooltipProvider>
                        {children}
                        <Toaster position="top-right" richColors />
                      </TooltipProvider>
                    </SearchProvider>
                  </LayoutProvider>
                </DirectionProvider>
              </FontProvider>
            </ActiveThemeProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}