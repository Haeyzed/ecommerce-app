"use client"

import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
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
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

import { useCreateTax, useUpdateTax } from "../api"
import { taxSchema, type TaxFormData } from "../schemas"
import type { Tax } from "../types"

interface TaxesActionDialogProps {
  currentRow?: Tax
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaxesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: TaxesActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: createTax, isPending: isCreating } = useCreateTax()
  const { mutate: updateTax, isPending: isUpdating } = useUpdateTax()
  const isLoading = isCreating || isUpdating

  const form = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            name: currentRow.name,
            rate: currentRow.rate,
            woocommerce_tax_id: currentRow.woocommerce_tax_id ?? null,
            is_active: currentRow.is_active,
          }
        : {
            name: "",
            rate: 0,
            woocommerce_tax_id: null,
            is_active: true,
          },
  })

  const onSubmit = (values: TaxFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }
    if (isEdit && currentRow) {
      updateTax({ id: currentRow.id, data: values }, options)
    } else {
      createTax(values, options)
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
            {isEdit ? "Edit Tax" : "Add New Tax"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit
              ? "Update the tax details here. "
              : "Create a new tax here. "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-3">
          <TaxForm
            form={form}
            onSubmit={onSubmit}
            id="tax-form"
          />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button type="submit" form="tax-form" disabled={isLoading}>
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

interface TaxFormProps {
  form: UseFormReturn<TaxFormData>
  onSubmit: (data: TaxFormData) => void
  id: string
}

function TaxForm({ form, onSubmit, id }: TaxFormProps) {
  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="tax-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="tax-name"
                placeholder="Tax name"
                autoComplete="off"
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="rate"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="tax-rate">
                Rate (%) <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="tax-rate"
                type="number"
                min={0}
                max={100}
                step="0.01"
                placeholder="0"
                autoComplete="off"
                {...field}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
              />
              <FieldDescription>Rate between 0 and 100.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="woocommerce_tax_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="tax-woocommerce">WooCommerce Tax ID</FieldLabel>
              <Input
                id="tax-woocommerce"
                type="number"
                placeholder="Optional"
                autoComplete="off"
                {...field}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
              <FieldDescription>Optional. Leave empty if not used.</FieldDescription>
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
                <FieldLabel htmlFor="tax-active">Active Status</FieldLabel>
                <FieldDescription>
                  Inactive taxes are hidden from active selections.
                </FieldDescription>
              </div>
              <Switch
                id="tax-active"
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
