"use client"

import * as React from "react"
import Image from "next/image"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, CloudUpload } from "lucide-react"

import { generateSlug } from "@/lib/slug"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { ImageZoom } from "@/components/ui/image-zoom"
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { useCreateProduct, useUpdateProduct } from "../api"
import { productSchema, type ProductFormData } from "../schemas"
import type { Product } from "../types"
import { CropperFileUpload } from "@/components/cropper-file-upload"

interface ProductsActionDialogProps {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ProductsActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()
  const isLoading = isCreating || isUpdating

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues:
      isEdit && currentRow
        ? {
            name: currentRow.name,
            slug: currentRow.slug ?? "",
            short_description: currentRow.short_description ?? "",
            page_title: currentRow.page_title ?? "",
            is_active: currentRow.is_active,
            image_path: [],
          }
        : {
            name: "",
            slug: "",
            short_description: "",
            page_title: "",
            is_active: true,
            image_path: [],
          },
  })

  const onSubmit = (values: ProductFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }
    if (isEdit && currentRow) {
      updateProduct({ id: currentRow.id, data: values }, options)
    } else {
      createProduct(values, options)
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
            {isEdit ? "Edit Product" : "Add New Product"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit
              ? "Update the product details here. "
              : "Create a new product here. "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-3">
          <ProductForm
            form={form}
            onSubmit={onSubmit}
            id="product-form"
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button type="submit" form="product-form" disabled={isLoading}>
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

interface ProductFormProps {
  form: UseFormReturn<ProductFormData>
  onSubmit: (data: ProductFormData) => void
  id: string
  isEdit: boolean
  currentRow?: Product
}

function ProductForm({ form, onSubmit, id, isEdit, currentRow }: ProductFormProps) {
  const [isSlugDisabled, setIsSlugDisabled] = React.useState(true)

  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="product-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="product-name"
                placeholder="Product name"
                autoComplete="off"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  if (isSlugDisabled) {
                    form.setValue("slug", generateSlug(e.target.value), {
                      shouldValidate: true,
                    })
                  }
                }}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="product-slug">Slug</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id="product-slug"
                  placeholder="product-slug"
                  autoComplete="off"
                  {...field}
                  value={field.value ?? ""}
                  disabled={isSlugDisabled}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => setIsSlugDisabled((prev) => !prev)}
                  title={isSlugDisabled ? "Enable editing" : "Disable editing"}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
              <FieldDescription>
                URL-friendly version of the name (auto-generated)
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="short_description"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="product-description">Description</FieldLabel>
              <Textarea
                id="product-description"
                placeholder="Product description"
                rows={3}
                className="resize-none"
                {...field}
                value={field.value ?? ""}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="page_title"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="product-page-title">Page Title</FieldLabel>
              <Input
                id="product-page-title"
                placeholder="SEO Page Title"
                autoComplete="off"
                {...field}
                value={field.value ?? ""}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="image_path"
          render={({ field: { value, onChange }, fieldState }) => {
            const existingImageUrl =
              isEdit && currentRow?.image_url ? currentRow.image_url : null
            const hasNewImage = Array.isArray(value) && value.length > 0

            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="product-image">Image</FieldLabel>

                {existingImageUrl && !hasNewImage && (
                  <div className="mb-3 flex items-center gap-3 rounded-md border p-3">
                    <div className="relative size-16 overflow-hidden rounded-md bg-muted">
                      <ImageZoom>
                        <Image
                          src={existingImageUrl}
                          alt={currentRow?.name ?? "Product image"}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </ImageZoom>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Image</p>
                      <p className="text-xs text-muted-foreground">
                        Upload a new image to replace this one
                      </p>
                    </div>
                  </div>
                )}

                <CropperFileUpload
                  value={value ?? []}
                  onValueChange={onChange}
                  accept="image/*"
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024}
                  onFileReject={(_file, message) => {
                    form.setError("image_path", { message })
                  }}
                />
                <FieldDescription>
                  JPEG, PNG, JPG, GIF, or WebP. Max 5MB.
                </FieldDescription>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
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
                <FieldLabel htmlFor="product-active">Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the product from public view.
                </FieldDescription>
              </div>
              <Switch
                id="product-active"
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
