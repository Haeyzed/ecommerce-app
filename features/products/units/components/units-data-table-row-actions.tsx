"use client"

import type { Row } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const { setOpen, setCurrentRow } = useUnitsContext()
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canView = userPermissions.includes(PERMISSIONS.view)
  const canUpdate = userPermissions.includes(PERMISSIONS.update)
  const canDelete = userPermissions.includes(PERMISSIONS.delete)

  if (!canView && !canUpdate && !canDelete) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {canView && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen("view")
              }}
            >
              View
              <Eye className="ml-auto size-4" />
            </DropdownMenuItem>
            {(canUpdate || canDelete) && <DropdownMenuSeparator />}
          </>
        )}
        {canUpdate && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen("edit")
              }}
            >
              Edit
              <Pencil className="ml-auto size-4" />
            </DropdownMenuItem>
            {canDelete && <DropdownMenuSeparator />}
          </>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen("delete")
            }}
            className="text-destructive focus:text-destructive"
          >
            Delete
            <Trash2 className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}