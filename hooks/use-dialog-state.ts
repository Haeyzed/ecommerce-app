import { useState } from "react"

/**
 * Toggle-style dialog state: setOpen(type) opens that dialog; setOpen(type) again (or when already open) closes it.
 * @example const [open, setOpen] = useDialogState<"add" | "edit">(null)
 */
export function useDialogState<T extends string | boolean>(initialState: T | null = null) {
  const [open, setOpenInternal] = useState<T | null>(initialState)
  const setOpen = (value: T | null) =>
    setOpenInternal((prev) => (prev === value ? null : value))
  return [open, setOpen] as const
}
