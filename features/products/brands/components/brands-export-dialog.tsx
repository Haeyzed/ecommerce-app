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

import { useBrandsExport } from "../api"
import { BRAND_EXPORT_COLUMNS, DEFAULT_EXPORT_COLUMNS } from "../constants"
import { brandExportSchema, type BrandExportFormData } from "../schemas"
import { DateRangePicker } from "@/components/date-range-picker"

interface BrandsExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids?: number[]
}

export function BrandsExportDialog({
  open,
  onOpenChange,
  ids = [],
}: BrandsExportDialogProps) {
  const { mutate: exportBrands, isPending } = useBrandsExport()
  const { api } = useApiClient()

  const form = useForm<BrandExportFormData>({
    resolver: zodResolver(brandExportSchema),
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

  const onSubmit = (data: BrandExportFormData) => {
    exportBrands(
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
          <ResponsiveDialogTitle>Export Brands</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Select export format, method, and columns.
            {ids.length > 0 && ` ${ids.length} brand(s) selected.`}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <form
            id="export-form"
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
                            : undefined,
                          { shouldValidate: true, shouldDirty: true }
                        )
                        form.setValue(
                          "end_date",
                          range?.to
                            ? format(range.to, "yyyy-MM-dd")
                            : undefined,
                          { shouldValidate: true, shouldDirty: true }
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
                render={({ field, fieldState }) => (
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
                            Excel (XLSX)
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
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="method"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Method</FieldLabel>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        if (value === "download") {
                          form.setValue("user_id", undefined)
                        }
                      }}
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
                            Send via Email
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {method === "email" && (
                <Controller
                  control={form.control}
                  name="user_id"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Select User</FieldLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : undefined)
                        }
                        disabled={isLoadingUsers}
                      >
                        <SelectTrigger data-invalid={!!fieldState.error}>
                          <SelectValue placeholder="Select user to send email to" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Select a user to receive the export file via email
                      </FieldDescription>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              <Controller
                control={form.control}
                name="columns"
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel>Columns</FieldLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            form.setValue(
                              "columns",
                              BRAND_EXPORT_COLUMNS.map((c) => c.value)
                            )
                          }
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => form.setValue("columns", [])}
                        >
                          Deselect All
                        </Button>
                      </div>
                    </div>
                    <div className="grid max-h-60 grid-cols-2 gap-3 overflow-y-auto rounded-md border p-3">
                      {BRAND_EXPORT_COLUMNS.map((column) => (
                        <div
                          key={column.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`column-${column.value}`}
                            checked={
                              field.value?.includes(column.value) ?? false
                            }
                            onCheckedChange={(checked) => {
                              const current = field.value ?? []
                              if (checked) {
                                field.onChange([...current, column.value])
                              } else {
                                field.onChange(
                                  current.filter((c) => c !== column.value)
                                )
                              }
                            }}
                          />
                          <Label
                            htmlFor={`column-${column.value}`}
                            className="cursor-pointer text-sm font-medium"
                          >
                            {column.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FieldDescription>
                      Select the columns to include in the export
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
            form="export-form"
            disabled={isPending || (method === "email" && isLoadingUsers)}
          >
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                Export
              </>
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
