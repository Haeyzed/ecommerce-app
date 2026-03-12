"use client"

import { SearchIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useSearch } from "@/lib/providers/search-provider"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export function SearchTrigger() {
  const { setOpen } = useSearch()

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 gap-1.5 border-dashed text-muted-foreground"
      onClick={() => setOpen(true)}
    >
      <HugeiconsIcon icon={SearchIcon} className="size-4" strokeWidth={2} />
      <span className="hidden sm:inline">Search</span>
      <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
    </Button>
  )
}
