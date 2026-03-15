"use client"

import * as React from "react"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  useBaseUnits,
  useCreateUnit,
  useUpdateUnit,
} from "../api"
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
            operator: currentRow.operator,
            operation_value: currentRow.operation_value ?? null,
            is_active: currentRow.is_active,
          }
        : {
            name: "",
            code: "",
            base_unit: null,
            operator: "*",
            operation_value: 1,
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
}

function UnitForm({ form, onSubmit, id, isEdit }: UnitFormProps) {
  const { data: baseUnits = [] } = useBaseUnits()

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
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
                placeholder="Kilogram"
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
                placeholder="kg"
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
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="unit-base">Base Unit</FieldLabel>
              <Select
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "none"
                }
                onValueChange={(v) =>
                  field.onChange(v === "none" ? null : Number(v))
                }
              >
                <SelectTrigger id="unit-base">
                  <SelectValue placeholder="None (base unit)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (base unit)</SelectItem>
                  {baseUnits.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Select a base unit to make this a derived unit, or leave as base.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="operator"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="unit-operator">Operator</FieldLabel>
              <Input
                id="unit-operator"
                placeholder="*"
                autoComplete="off"
                maxLength={1}
                {...field}
              />
              <FieldDescription>
                Operator used to convert this unit to its base unit (e.g. * or /).
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="operation_value"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="unit-operation-value">
                Operation value
              </FieldLabel>
              <Input
                id="unit-operation-value"
                type="number"
                step="0.0001"
                {...field}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
              <FieldDescription>
                Numeric value used with the operator to convert to the base unit.
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
                  Disabling this will hide the unit from use in products.
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

