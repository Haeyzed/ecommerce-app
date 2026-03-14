"use client"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ResponsiveDialog,
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
import { Loader2 } from "lucide-react"
import { useApiClient } from "@/lib/api/use-api-client"

import { useBrandsExport } from "../api"
import {
  brandExportSchema,
  type BrandExportFormData,
} from "../schemas"

const AVAILABLE_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "slug", label: "Slug" },
  { value: "short_description", label: "Short Description" },
  { value: "page_title", label: "Page Title" },
  { value: "image_url", label: "Image URL" },
  { value: "is_active", label: "Is Active" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
] as const

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
      columns: ["id", "name", "slug", "is_active"],
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
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Export Brands</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Select export format, method, and columns.
            {ids.length > 0 && ` ${ids.length} brand(s) selected.`}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="export-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <Field className="grid w-full gap-1.5">
                  <FieldLabel>Date range (optional)</FieldLabel>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || undefined)}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Controller
                      control={form.control}
                      name="end_date"
                      render={({ field: endField }) => (
                        <Input
                          type="date"
                          {...endField}
                          value={endField.value ?? ""}
                          onChange={(e) =>
                            endField.onChange(e.target.value || undefined)
                          }
                        />
                      )}
                    />
                  </div>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="format"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Format</FieldLabel>
                  <div className="flex gap-4">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === "excel"}
                        onChange={() => field.onChange("excel")}
                        className="rounded-full"
                      />
                      Excel (XLSX)
                    </Label>
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === "pdf"}
                        onChange={() => field.onChange("pdf")}
                        className="rounded-full"
                      />
                      PDF
                    </Label>
                  </div>
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
                  <div className="flex gap-4">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === "download"}
                        onChange={() => {
                          field.onChange("download")
                          form.setValue("user_id", undefined)
                        }}
                        className="rounded-full"
                      />
                      Download
                    </Label>
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === "email"}
                        onChange={() => field.onChange("email")}
                        className="rounded-full"
                      />
                      Send via Email
                    </Label>
                  </div>
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
                            AVAILABLE_COLUMNS.map((c) => c.value)
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
                    {AVAILABLE_COLUMNS.map((column) => (
                      <div
                        key={column.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`column-${column.value}`}
                          checked={field.value?.includes(column.value) ?? false}
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

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="export-form"
            disabled={
              isPending || (method === "email" && isLoadingUsers)
            }
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
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
