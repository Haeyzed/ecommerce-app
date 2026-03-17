"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

type NumberFieldContextValue = {
  id?: string
  value: number
  min?: number
  max?: number
  step: number
  disabled?: boolean
  formatOptions?: Intl.NumberFormatOptions
  setValue: (value: number) => void
}

const NumberFieldContext = React.createContext<NumberFieldContextValue | null>(
  null
)

function useNumberFieldContext(name: string) {
  const ctx = React.useContext(NumberFieldContext)
  if (!ctx) {
    throw new Error(`${name} must be used within NumberField`)
  }
  return ctx
}

function clamp(value: number, min?: number, max?: number) {
  if (min !== undefined && value < min) return min
  if (max !== undefined && value > max) return max
  return value
}

type NumberFieldProps = React.ComponentProps<"div"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  formatOptions?: Intl.NumberFormatOptions
}

function NumberField({
  className,
  id,
  value,
  defaultValue = 0,
  onValueChange,
  min,
  max,
  step = 1,
  disabled,
  formatOptions,
  children,
  ...props
}: NumberFieldProps) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = React.useCallback(
    (next: number) => {
      const safe = clamp(next, min, max)
      if (!isControlled) {
        setUncontrolledValue(safe)
      }
      onValueChange?.(safe)
    },
    [isControlled, max, min, onValueChange]
  )

  return (
    <NumberFieldContext.Provider
      value={{
        id,
        value: currentValue,
        min,
        max,
        step,
        disabled,
        formatOptions,
        setValue,
      }}
    >
      <div
        data-slot="number-field"
        data-disabled={disabled ? "" : undefined}
        className={cn("group flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </NumberFieldContext.Provider>
  )
}

function NumberFieldContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="number-field-content"
      className={cn(
        "inline-flex h-9 items-center overflow-hidden rounded-md border border-input bg-transparent shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function NumberFieldDecrement({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { value, step, min, disabled, setValue } =
    useNumberFieldContext("NumberFieldDecrement")

  return (
    <button
      type="button"
      data-slot="number-field-decrement"
      className={cn(
        "inline-flex size-9 items-center justify-center border-r text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || disabled) return
        setValue(clamp(value - step, min, undefined))
      }}
      disabled={disabled}
      aria-label="Decrease value"
      {...props}
    >
      <Minus className="size-4" />
    </button>
  )
}

function NumberFieldIncrement({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { value, step, max, disabled, setValue } =
    useNumberFieldContext("NumberFieldIncrement")

  return (
    <button
      type="button"
      data-slot="number-field-increment"
      className={cn(
        "inline-flex size-9 items-center justify-center border-l text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || disabled) return
        setValue(clamp(value + step, undefined, max))
      }}
      disabled={disabled}
      aria-label="Increase value"
      {...props}
    >
      <Plus className="size-4" />
    </button>
  )
}

function NumberFieldInput({
  className,
  onBlur,
  onFocus,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange">) {
  const { id, value, min, max, step, disabled, formatOptions, setValue } =
    useNumberFieldContext("NumberFieldInput")
  const [focused, setFocused] = React.useState(false)
  const [draft, setDraft] = React.useState(String(value))

  React.useEffect(() => {
    if (!focused) {
      setDraft(String(value))
    }
  }, [focused, value])

  const formattedValue = React.useMemo(() => {
    if (!formatOptions) return String(value)
    try {
      return new Intl.NumberFormat(undefined, formatOptions).format(value)
    } catch {
      return String(value)
    }
  }, [formatOptions, value])

  return (
    <input
      id={id}
      data-slot="number-field-input"
      inputMode="decimal"
      type="text"
      className={cn(
        "h-9 min-w-0 flex-1 bg-transparent px-2.5 text-center text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={focused ? draft : formattedValue}
      disabled={disabled}
      onFocus={(e) => {
        setFocused(true)
        setDraft(String(value))
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        const parsed = Number(draft)
        if (!Number.isNaN(parsed)) {
          setValue(clamp(parsed, min, max))
        } else {
          setDraft(String(value))
        }
        onBlur?.(e)
      }}
      onChange={(e) => {
        const next = e.target.value
        setDraft(next)
        const parsed = Number(next)
        if (!Number.isNaN(parsed)) {
          setValue(clamp(parsed, min, max))
        }
        onChange?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setValue(clamp(value + step, min, max))
        }
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setValue(clamp(value - step, min, max))
        }
      }}
      {...props}
    />
  )
}

export {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
}

