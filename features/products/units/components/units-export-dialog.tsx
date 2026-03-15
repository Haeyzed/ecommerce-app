"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

import { useUnitsExport } from "../api"
import type { UnitExportParams } from "../types"
import { DEFAULT_EXPORT_COLUMNS, UNIT_EXPORT_COLUMNS } from "../constants"

interface UnitsExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: number[]
}

export function UnitsExportDialog({
  open,
  onOpenChange,
  ids,
}: UnitsExportDialogProps) {
  const [columns, setColumns] = React.useState<string[]>(
    [...DEFAULT_EXPORT_COLUMNS]
  )
  const [format, setFormat] = React.useState<UnitExportParams["format"]>("excel")
  const [method, setMethod] = React.useState<UnitExportParams["method"]>("download")

  const { mutate: exportUnits, isPending } = useUnitsExport()

  const handleToggleColumn = (value: string) => {
    setColumns((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    )
  }

  const handleSubmit = () => {
    const payload: UnitExportParams = {
      ids: ids.length ? ids : undefined,
      format,
      method,
      columns,
    }
    exportUnits(payload, {
      onSuccess: () => {
        if (method !== "download") {
          onOpenChange(false)
        }
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Export Units</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Choose columns and format for exporting units. If no rows are selected,
            all units matching current filters will be exported.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-3">
          <FieldGroup>
            <Field>
              <FieldLabel>Format</FieldLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={format === "excel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("excel")}
                >
                  Excel
                </Button>
                <Button
                  type="button"
                  variant={format === "pdf" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("pdf")}
                >
                  PDF
                </Button>
              </div>
            </Field>

            <Field>
              <FieldLabel>Delivery method</FieldLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={method === "download" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMethod("download")}
                >
                  Download
                </Button>
                <Button
                  type="button"
                  variant={method === "email" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMethod("email")}
                >
                  Email
                </Button>
              </div>
            </Field>

            <Field>
              <FieldLabel>Columns</FieldLabel>
              <FieldDescription>
                Select which columns to include in the export.
              </FieldDescription>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {UNIT_EXPORT_COLUMNS.map((col) => (
                  <label
                    key={col.value}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={columns.includes(col.value)}
                      onCheckedChange={() => handleToggleColumn(col.value)}
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || columns.length === 0}
          >
            {isPending && <Spinner className="mr-2 size-4" />}
            Export
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

