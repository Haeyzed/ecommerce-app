"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
import { Switch } from "@/components/ui/switch"

import { useBaseUnits, useCreateUnit, useUpdateUnit } from "../api"
import { unitSchema, type UnitFormData } from "../schemas"
import type { Unit } from "../types"

interface UnitsActionDialogProps {
  currentRow?: Unit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnitsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UnitsActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: createUnit, isPending: isCreating } = useCreateUnit()
  const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnit()
  const isLoading = isCreating || isUpdating

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            name: currentRow.name,
            code: currentRow.code,
            base_unit: currentRow.base_unit ?? null,
            operator: currentRow.operator ?? null,
            operation_value: currentRow.operation_value ?? null,
            is_active: currentRow.is_active,
          }
        : {
            name: "",
            code: "",
            base_unit: null,
            operator: null,
            operation_value: null,
            is_active: true,
          },
  })

  const onSubmit = (values: UnitFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }
    if (isEdit && currentRow) {
      updateUnit({ id: currentRow.id, data: values }, options)
    } else {
      createUnit(values, options)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) form.reset()
    onOpenChange(value)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>
            {isEdit ? "Edit Unit" : "Add New Unit"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit
              ? "Update the unit details here. "
              : "Create a new unit here. "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-3">
          <UnitForm
            form={form}
            onSubmit={onSubmit}
            id="unit-form"
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button type="submit" form="unit-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

interface UnitFormProps {
  form: UseFormReturn<UnitFormData>
  onSubmit: (data: UnitFormData) => void
  id: string
  isEdit: boolean
  currentRow?: Unit
}

function UnitForm({ form, onSubmit, id, isEdit, currentRow }: UnitFormProps) {
  const [openCombobox, setOpenCombobox] = useState(false)
  const { data: baseUnits = [], isLoading: isLoadingBaseUnits } = useBaseUnits()

  const availableBaseUnits = useMemo(() => {
    return baseUnits.filter((u) => !isEdit || u.value !== currentRow?.id)
  }, [baseUnits, isEdit, currentRow])

  const unitItems = useMemo(
    () =>
      availableBaseUnits.map((unit) => ({
        id: unit.value,
        label: unit.label,
      })),
    [availableBaseUnits]
  )

  const name = form.watch("name")
  const baseUnitId = form.watch("base_unit")
  const operator = form.watch("operator")
  const operationValue = form.watch("operation_value")

  const selectedBaseUnitForPreview = useMemo(
    () => unitItems.find((u) => u.id === baseUnitId),
    [unitItems, baseUnitId]
  )

  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="unit-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="unit-name"
                placeholder="Unit name (e.g. Kilogram)"
                autoComplete="off"
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="unit-code">
                Code <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="unit-code"
                placeholder="Short code (e.g. kg)"
                autoComplete="off"
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="base_unit"
          render={({ field, fieldState }) => {
            const selectedUnit = unitItems.find(
              (unit) => unit.id === field.value
            )

            return (
              <Field
                data-invalid={!!fieldState.error}
                className="flex flex-col"
              >
                <FieldLabel htmlFor="unit-base-unit">Base Unit</FieldLabel>
                <Combobox
                  items={unitItems}
                  value={selectedUnit || null}
                  onValueChange={(value) => {
                    field.onChange(value ? value.id : null)
                    if (!value) {
                      form.setValue("operator", null)
                      form.setValue("operation_value", null)
                    }
                    setOpenCombobox(false)
                  }}
                  open={openCombobox}
                  onOpenChange={setOpenCombobox}
                  itemToStringValue={(item) => String(item.id)}
                >
                  <ComboboxInput
                    id="unit-base-unit"
                    placeholder="Select base unit (optional)"
                    autoComplete="off"
                    showClear
                    value={selectedUnit ? selectedUnit.label : ""}
                    data-invalid={!!fieldState.error}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No base units found.</ComboboxEmpty>
                    <ComboboxList>
                      {isLoadingBaseUnits && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          <Spinner className="mx-auto mb-2 size-4" />
                          Loading units...
                        </div>
                      )}

                      {!isLoadingBaseUnits &&
                        unitItems.map((item) => (
                          <ComboboxItem key={item.id} value={item}>
                            {item.label}
                          </ComboboxItem>
                        ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldDescription>
                  Optional: define relation to another unit.
                </FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        {form.watch("base_unit") && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="operator"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="operator">Operator</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                      value={field.value || undefined}
                    >
                      <SelectTrigger id="operator">
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="*">Multiply (*)</SelectItem>
                        <SelectItem value="/">Divide (/)</SelectItem>
                        <SelectItem value="+">Add (+)</SelectItem>
                        <SelectItem value="-">Subtract (-)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>Conversion operator.</FieldDescription>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="operation_value"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="operation-value">
                      Operation Value
                    </FieldLabel>
                    <Input
                      id="operation-value"
                      type="number"
                      step="0.001"
                      placeholder="e.g. 1000"
                      autoComplete="off"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        field.onChange(val === "" ? null : Number(val))
                      }}
                    />
                    <FieldDescription>Conversion value.</FieldDescription>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
              {name &&
                operator &&
                operationValue &&
                selectedBaseUnitForPreview && (
                  <div className="mb-3 border-b border-border/50 pb-3 text-foreground">
                    <div className="mb-1 font-semibold">Preview:</div>
                    <div className="inline-block rounded border bg-background px-2 py-1 font-mono">
                      1 {name} = 1{" "}
                      <span className="font-bold text-primary">{operator}</span>{" "}
                      {operationValue} {selectedBaseUnitForPreview.label}
                    </div>
                  </div>
                )}

              <strong className="mb-2 block text-foreground">
                Example conversions:
              </strong>
              <div className="grid gap-1">
                <div>
                  1 Dozen = 1 <strong>*</strong> 12 Piece
                </div>
                <div>
                  1 Gram = 1 <strong>/</strong> 1000 Kilogram
                </div>
                <div>
                  1 Meter = 1 <strong>*</strong> 100 Centimeter
                </div>
                <div>
                  1 Box = 1 <strong>*</strong> 10 Pack
                </div>
              </div>
            </div>
          </>
        )}

        <Controller
          control={form.control}
          name="is_active"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className="flex flex-row items-center justify-between rounded-md border p-4"
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="unit-active">Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the unit from selection.
                </FieldDescription>
              </div>
              <Switch
                id="unit-active"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
