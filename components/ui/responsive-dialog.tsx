"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const ResponsiveDialogContext = React.createContext<{ isMobile: boolean } | null>(
  null
)

function useResponsiveDialog() {
  const ctx = React.useContext(ResponsiveDialogContext)
  if (!ctx) {
    throw new Error(
      "ResponsiveDialog components must be used within ResponsiveDialog"
    )
  }
  return ctx
}

interface ResponsiveDialogProps extends React.ComponentProps<typeof Dialog> {
  breakpoint?: number
}

function ResponsiveDialog({
  breakpoint = 768,
  open,
  onOpenChange,
  ...props
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile(breakpoint)
  const contextValue = React.useMemo(() => ({ isMobile }), [isMobile])

  return (
    <ResponsiveDialogContext.Provider value={contextValue}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange} {...props} />
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange} {...props} />
      )}
    </ResponsiveDialogContext.Provider>
  )
}

function ResponsiveDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  const { isMobile } = useResponsiveDialog()

  if (isMobile) {
    return (
      <DrawerContent
        className={cn(
          "max-h-[90vh] overflow-y-auto overscroll-contain px-4 pb-6",
          "touch-pan-y",
          className
        )}
        {...props}
      />
    )
  }

  return <DialogContent className={className} {...props} />
}

function ResponsiveDialogHeader(
  props: React.ComponentProps<typeof DialogHeader>
) {
  const { isMobile } = useResponsiveDialog()
  if (isMobile) return <DrawerHeader {...props} />
  return <DialogHeader {...props} />
}

function ResponsiveDialogFooter(
  props: React.ComponentProps<typeof DialogFooter>
) {
  const { isMobile } = useResponsiveDialog()
  if (isMobile) return <DrawerFooter {...props} />
  return <DialogFooter {...props} />
}

function ResponsiveDialogTitle(
  props: React.ComponentProps<typeof DialogTitle>
) {
  const { isMobile } = useResponsiveDialog()
  if (isMobile) return <DrawerTitle {...props} />
  return <DialogTitle {...props} />
}

function ResponsiveDialogDescription(
  props: React.ComponentProps<typeof DialogDescription>
) {
  const { isMobile } = useResponsiveDialog()
  if (isMobile) return <DrawerDescription {...props} />
  return <DialogDescription {...props} />
}

function ResponsiveDialogTrigger(
  props: React.ComponentProps<typeof DialogTrigger>
) {
  const { isMobile } = useResponsiveDialog()
  if (isMobile) return <DrawerTrigger {...props} />
  return <DialogTrigger {...props} />
}

export {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
}
