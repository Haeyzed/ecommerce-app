"use client"

import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import type { Unit } from "../types"
import { useUnitsContext } from "./units-provider"

interface UnitsDataTableRowActionsProps {
  row: Row<Unit>
}

export function UnitsDataTableRowActions({
  row,
}: UnitsDataTableRowActionsProps) {
  const unit = row.original
  const { setOpen, setCurrentRow } = useUnitsContext()
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canUpdate = userPermissions.includes(PERMISSIONS.update)
  const canDelete = userPermissions.includes(PERMISSIONS.delete)
  const canView = userPermissions.includes(PERMISSIONS.view)

  const handleOpen = (type: "view" | "edit" | "delete") => {
    setCurrentRow(unit)
    setOpen(type)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 items-center justify-center p-0"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open row actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {canView && (
          <DropdownMenuItem onClick={() => handleOpen("view")}>
            View details
          </DropdownMenuItem>
        )}
        {canUpdate && (
          <DropdownMenuItem onClick={() => handleOpen("edit")}>
            Edit
          </DropdownMenuItem>
        )}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleOpen("delete")}
            >
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

