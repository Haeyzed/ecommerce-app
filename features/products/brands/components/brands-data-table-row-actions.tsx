"use client"

import type { Row } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { Brand } from "../types"
import { useBrandsContext } from "./brands-provider"

interface BrandsDataTableRowActionsProps {
  row: Row<Brand>
}

export function BrandsDataTableRowActions({
  row,
}: BrandsDataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useBrandsContext()

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
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen("edit")
          }}
        >
          Edit
          <Pencil className="ml-auto size-4" />
        </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
