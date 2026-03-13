"use client"

import { CalendarIcon } from "lucide-react"
import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate, toLocalYYYYMMDD } from "@/lib/format"
import { cn } from "@/lib/utils"

export interface BrandsDateRangeFilterProps {
  startDate: string
  endDate: string
  setStartDate: (value: string | null) => void
  setEndDate: (value: string | null) => void
}

export function BrandsDateRangeFilter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: BrandsDateRangeFilterProps) {
  const [open, setOpen] = React.useState(false)

  const from = startDate ? new Date(startDate) : undefined
  const to = endDate ? new Date(endDate) : undefined
  const range: DateRange | undefined =
    from || to ? { from: from ?? to, to: to ?? from } : undefined

  const displayValue =
    from && to && from.getTime() !== to.getTime()
      ? `${formatDate(from, { month: "short" })} – ${formatDate(to, { month: "short" })}`
      : from
        ? formatDate(from, { month: "short" })
        : "Date range"

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from) {
        setStartDate(null)
        setEndDate(null)
        return
      }
      setStartDate(toLocalYYYYMMDD(range.from))
      setEndDate(range.to ? toLocalYYYYMMDD(range.to) : null)
      if (range.from && range.to) setOpen(false)
    },
    [setStartDate, setEndDate]
  )

  const hasValue = !!startDate || !!endDate
  const clear = React.useCallback(() => {
    setStartDate(null)
    setEndDate(null)
    setOpen(false)
  }, [setStartDate, setEndDate])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 justify-start text-left font-normal",
            !hasValue && "text-muted-foreground"
          )}
          aria-label="Filter by date range"
        >
          <CalendarIcon className="mr-2 size-4" />
          <span className="truncate">{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          captionLayout="dropdown"
          numberOfMonths={2}
          defaultMonth={from ?? to ?? new Date()}
          aria-label="Select date range"
        />
        {hasValue && (
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={clear}>
              Clear dates
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
