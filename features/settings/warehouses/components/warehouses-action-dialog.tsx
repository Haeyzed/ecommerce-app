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

import { useCreateWarehouse, useUpdateWarehouse } from "../api"
import { warehouseSchema, type WarehouseFormData } from "../schemas"
import type { Warehouse } from "../types"
import {PhoneInput} from "@/components/ui/phone-input";

interface WarehousesActionDialogProps {
  currentRow?: Warehouse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WarehousesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: WarehousesActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: createWarehouse, isPending: isCreating } = useCreateWarehouse()
  const { mutate: updateWarehouse, isPending: isUpdating } = useUpdateWarehouse()
  const isLoading = isCreating || isUpdating

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            name: currentRow.name,
            phone_number: currentRow.phone_number,
            email: currentRow.email ?? null,
            address: currentRow.address,
            is_active: currentRow.is_active,
          }
        : {
            name: "",
            phone_number: "",
            email: null,
            address: "",
            is_active: true,
          },
  })

  const onSubmit = (values: WarehouseFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }
    if (isEdit && currentRow) {
      updateWarehouse({ id: currentRow.id, data: values }, options)
    } else {
      createWarehouse(values, options)
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
            {isEdit ? "Edit Warehouse" : "Add New Warehouse"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit
              ? "Update the warehouse details here. "
              : "Create a new warehouse here. "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-3">
          <WarehouseForm
            form={form}
            onSubmit={onSubmit}
            id="warehouse-form"
          />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button type="submit" form="warehouse-form" disabled={isLoading}>
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

interface WarehouseFormProps {
  form: UseFormReturn<WarehouseFormData>
  onSubmit: (data: WarehouseFormData) => void
  id: string
}

function WarehouseForm({ form, onSubmit, id }: WarehouseFormProps) {
  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="warehouse-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="warehouse-name"
                placeholder="Warehouse name"
                autoComplete="off"
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="phone_number"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="warehouse-phone">
                Phone Number <span className="text-destructive">*</span>
              </FieldLabel>
              <PhoneInput
                id="warehouse-phone"
                placeholder="+1234567890"
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="warehouse-email">Email</FieldLabel>
              <Input
                id="warehouse-email"
                type="email"
                placeholder="warehouse@example.com"
                autoComplete="off"
                {...field}
                value={field.value ?? ""}
              />
              <FieldDescription>Optional contact email.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="warehouse-address">
                Address <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="warehouse-address"
                placeholder="123 Storage Lane"
                autoComplete="off"
                {...field}
              />
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
                <FieldLabel htmlFor="warehouse-active">Active Status</FieldLabel>
                <FieldDescription>
                  Inactive warehouses are hidden from active selections.
                </FieldDescription>
              </div>
              <Switch
                id="warehouse-active"
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
