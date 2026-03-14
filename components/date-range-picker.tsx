"use client"

import * as React from "react"
import {
  endOfMonth,
  endOfYear,
  format,
  isSameDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns"
import type { DateRange } from "react-day-picker"

import { CalendarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
  /** When true, only render calendar + quick select (no trigger/popover). Use inside another Popover. */
  inline?: boolean
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  disabled,
  error,
  className,
  inline = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const isDesktop = !isMobile

  const today = new Date()
  const presets = [
    { label: "Today", range: { from: today, to: today } },
    {
      label: "Yesterday",
      range: { from: subDays(today, 1), to: subDays(today, 1) },
    },
    {
      label: "Last 7 days",
      range: { from: subDays(today, 6), to: today },
    },
    {
      label: "Last 30 days",
      range: { from: subDays(today, 29), to: today },
    },
    {
      label: "This Month",
      range: { from: startOfMonth(today), to: endOfMonth(today) },
    },
    {
      label: "Last Month",
      range: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    },
    {
      label: "This Year",
      range: { from: startOfYear(today), to: endOfYear(today) },
    },
  ]

  const handlePresetClick = (range: DateRange) => {
    onChange?.(range)
  }

  const checkIsActive = (presetRange: DateRange) => {
    if (!value?.from || !value?.to || !presetRange.from || !presetRange.to)
      return false
    return (
      isSameDay(value.from, presetRange.from) &&
      isSameDay(value.to, presetRange.to)
    )
  }

  const content = (
    <div className="flex flex-col divide-y sm:flex-row sm:divide-x sm:divide-y-0">
      {isDesktop && (
        <div className="flex flex-col gap-1 bg-muted/20 p-3 sm:w-40">
          <span className="mb-1 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Quick Select
          </span>
          {presets.map((preset) => {
            const isActive = checkIsActive(preset.range)
            return (
              <Button
                key={preset.label}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handlePresetClick(preset.range)}
                className={cn(
                  "justify-start font-normal transition-all",
                  isActive && "font-medium"
                )}
              >
                {preset.label}
              </Button>
            )
          })}
        </div>
      )}

      <div className="p-1">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={isDesktop ? 2 : 1}
          initialFocus={!inline}
          captionLayout="dropdown"
          fromYear={1990}
          toYear={today.getFullYear() + 10}
        />
      </div>
    </div>
  )

  if (inline) {
    return (
      <div className={cn("w-auto p-0 shadow-lg", className)}>{content}</div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          disabled={disabled}
          className={cn(
            "justify-start px-2.5 text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
        >
          <HugeiconsIcon
            icon={CalendarIcon}
            strokeWidth={2}
            className="mr-2 size-4 shrink-0"
          />
          <span className="truncate">
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 shadow-lg" align="start">
        {content}
      </PopoverContent>
    </Popover>
  )
}
