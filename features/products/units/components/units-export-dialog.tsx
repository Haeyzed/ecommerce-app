"use client"

import { format } from "date-fns"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useApiClient } from "@/lib/api/use-api-client"
import { DateRangePicker } from "@/components/date-range-picker"

import { useUnitsExport } from "../api"
import { UNIT_EXPORT_COLUMNS, DEFAULT_EXPORT_COLUMNS } from "../constants"
import { unitExportSchema, type UnitExportFormData } from "../schemas"

interface UnitsExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids?: number[]
}

export function UnitsExportDialog({
  open,
  onOpenChange,
  ids = [],
}: UnitsExportDialogProps) {
  const { mutate: exportUnits, isPending } = useUnitsExport()
  const { api } = useApiClient()

  const form = useForm<UnitExportFormData>({
    resolver: zodResolver(unitExportSchema),
    defaultValues: {
      format: "excel",
      method: "download",
      columns: [...DEFAULT_EXPORT_COLUMNS],
      start_date: undefined,
      end_date: undefined,
    },
  })

  const method = form.watch("method")

  const { data: usersResponse, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", "list"],
    queryFn: async () =>
      api.get<Array<{ id: number; name: string; email: string }>>("/users", {
        params: { per_page: 100 },
      }),
    enabled: open && method === "email",
  })

  const users = usersResponse?.data ?? []

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  const onSubmit = (data: UnitExportFormData) => {
    exportUnits(
      {
        ids: ids.length > 0 ? ids : undefined,
        format: data.format,
        method: data.method,
        columns: data.columns,
        user_id: data.method === "email" ? data.user_id : undefined,
        start_date: data.start_date,
        end_date: data.end_date,
      },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-2xl">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Export Units</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Select export format, method, and columns.
            {ids.length > 0 && ` ${ids.length} unit(s) selected.`}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <form
            id="unit-export-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="start_date"
                render={({ fieldState }) => (
                  <Field className="grid w-full gap-1.5">
                    <FieldLabel>Date range (optional)</FieldLabel>
                    <DateRangePicker
                      value={{
                        from: form.watch("start_date")
                          ? new Date(form.watch("start_date")!)
                          : undefined,
                        to: form.watch("end_date")
                          ? new Date(form.watch("end_date")!)
                          : undefined,
                      }}
                      onChange={(range) => {
                        form.setValue(
                          "start_date",
                          range?.from
                            ? format(range.from, "yyyy-MM-dd")
                            : undefined
                        )
                        form.setValue(
                          "end_date",
                          range?.to ? format(range.to, "yyyy-MM-dd") : undefined
                        )
                      }}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="format"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Format</FieldLabel>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="excel" id="format-excel" />
                          <Label
                            htmlFor="format-excel"
                            className="cursor-pointer font-medium"
                          >
                            Excel
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="pdf" id="format-pdf" />
                          <Label
                            htmlFor="format-pdf"
                            className="cursor-pointer font-medium"
                          >
                            PDF
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="method"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Method</FieldLabel>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value="download"
                            id="method-download"
                          />
                          <Label
                            htmlFor="method-download"
                            className="cursor-pointer font-medium"
                          >
                            Download
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="email" id="method-email" />
                          <Label
                            htmlFor="method-email"
                            className="cursor-pointer font-medium"
                          >
                            Email
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </Field>
                )}
              />

              {method === "email" && (
                <Controller
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Select User</FieldLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={field.value ? String(field.value) : ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((u) => (
                            <SelectItem key={u.id} value={String(u.id)}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              )}

              <Controller
                control={form.control}
                name="columns"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Columns</FieldLabel>
                    <div className="grid grid-cols-2 gap-3 rounded-md border p-3">
                      {UNIT_EXPORT_COLUMNS.map((col) => (
                        <div
                          key={col.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={field.value.includes(col.value)}
                            onCheckedChange={(checked) => {
                              const val = checked
                                ? [...field.value, col.value]
                                : field.value.filter((v) => v !== col.value)
                              field.onChange(val)
                            }}
                          />
                          <span className="text-sm">{col.label}</span>
                        </div>
                      ))}
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="unit-export-form" disabled={isPending}>
            {isPending ? (
              <Spinner className="mr-2" />
            ) : (
              <Upload className="mr-2 size-4" />
            )}
            Export
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
