"use client"

import { format } from "date-fns"
import * as React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
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

import { useTaxesExport } from "../api"
import { DEFAULT_EXPORT_COLUMNS, TAX_EXPORT_COLUMNS } from "../constants"
import { taxExportSchema, type TaxExportFormData } from "../schemas"

interface TaxesExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids?: number[]
}

export function TaxesExportDialog({
  open,
  onOpenChange,
  ids = [],
}: TaxesExportDialogProps) {
  const { mutate: exportTaxes, isPending } = useTaxesExport()
  const { api } = useApiClient()

  const form = useForm<TaxExportFormData>({
    resolver: zodResolver(taxExportSchema),
    defaultValues: {
      format: "excel",
      method: "download",
      columns: [...DEFAULT_EXPORT_COLUMNS],
      start_date: undefined,
      end_date: undefined,
    },
  })

  const method = useWatch({ control: form.control, name: "method" })
  const startDate = useWatch({ control: form.control, name: "start_date" })
  const endDate = useWatch({ control: form.control, name: "end_date" })

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

  const onSubmit = (data: TaxExportFormData) => {
    exportTaxes(
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
          <ResponsiveDialogTitle>Export Taxes</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Select export format, method, and columns.
            {ids.length > 0 && ` ${ids.length} tax(es) selected.`}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <form
            id="tax-export-form"
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
                        from: startDate ? new Date(startDate) : undefined,
                        to: endDate ? new Date(endDate) : undefined,
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
                        disabled={isLoadingUsers}
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
                      {TAX_EXPORT_COLUMNS.map((col) => (
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
          <Button
            type="submit"
            form="tax-export-form"
            disabled={isPending}
          >
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
