"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthSession } from "@/features/auth/api"

import { PERMISSIONS } from "../constants"
import { useUnitsContext } from "./units-provider"

export function UnitsPrimaryButtons() {
  const { setOpen } = useUnitsContext()
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const canCreate = userPermissions.includes(PERMISSIONS.create)

  if (!canCreate) return null

  return (
    <Button
      type="button"
      size="sm"
      onClick={() => setOpen("add")}
      className="h-8"
    >
      <Plus className="mr-2 size-4" />
      Add unit
    </Button>
  )
}

