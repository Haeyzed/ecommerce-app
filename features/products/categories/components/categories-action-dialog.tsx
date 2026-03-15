"use client"

import * as React from "react"
import Image from "next/image"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CloudUpload, Pencil } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import {
  useCreateCategory,
  useOptionCategories,
  useUpdateCategory,
} from "../api"
import { categorySchema, type CategoryFormData } from "../schemas"
import type { Category } from "../types"
import { CropperFileUpload } from "@/components/cropper-file-upload"

interface CategoriesActionDialogProps {
  currentRow?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CategoriesActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()
  const isLoading = isCreating || isUpdating

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues:
      isEdit && currentRow
        ? {
            name: currentRow.name,
            slug: currentRow.slug ?? "",
            short_description: currentRow.short_description ?? "",
            page_title: currentRow.page_title ?? "",
            parent_id: currentRow.parent_id ?? currentRow.parent?.id ?? null,
            is_active: currentRow.is_active,
            featured: currentRow.featured,
            is_sync_disable: currentRow.is_sync_disable,
            image: [],
            icon: [],
          }
        : {
            name: "",
            slug: "",
            short_description: "",
            page_title: "",
            parent_id: null,
            is_active: true,
            featured: false,
            is_sync_disable: false,
            image: [],
            icon: [],
          },
  })

  const onSubmit = (values: CategoryFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    }
    if (isEdit && currentRow) {
      updateCategory({ id: currentRow.id, data: values }, options)
    } else {
      createCategory(values, options)
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
            {isEdit ? "Edit Category" : "Add New Category"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit
              ? "Update the category details here. "
              : "Create a new category here. "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-3">
          <CategoryForm
            form={form}
            onSubmit={onSubmit}
            id="category-form"
            isEdit={isEdit}
            currentRow={currentRow}
          />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button
            type="submit"
            form="category-form"
            disabled={isLoading}
          >
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

interface CategoryFormProps {
  form: UseFormReturn<CategoryFormData>
  onSubmit: (data: CategoryFormData) => void
  id: string
  isEdit: boolean
  currentRow?: Category
}

function CategoryForm({
  form,
  onSubmit,
  id,
  isEdit,
  currentRow,
}: CategoryFormProps) {
  const [isSlugDisabled, setIsSlugDisabled] = React.useState(true)
  const { data: optionCategories = [] } = useOptionCategories()
  const parentOptions = React.useMemo(() => {
    if (!isEdit || !currentRow) return optionCategories
    return optionCategories.filter((o) => o.value !== currentRow.id)
  }, [optionCategories, isEdit, currentRow])

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
              <FieldLabel htmlFor="category-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="category-name"
                placeholder="Category name"
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
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="category-slug">Slug</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id="category-slug"
                  placeholder="category-slug"
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
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="parent_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="category-parent">Parent Category</FieldLabel>
              <Select
                value={field.value != null ? String(field.value) : "none"}
                onValueChange={(v) =>
                  field.onChange(v === "none" ? null : Number(v))
                }
              >
                <SelectTrigger id="category-parent">
                  <SelectValue placeholder="None (root category)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (root category)</SelectItem>
                  {parentOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={String(opt.value)}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="short_description"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="category-description">Description</FieldLabel>
              <Textarea
                id="category-description"
                placeholder="Category description"
                rows={3}
                className="resize-none"
                {...field}
                value={field.value ?? ""}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="page_title"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="category-page-title">Page Title</FieldLabel>
              <Input
                id="category-page-title"
                placeholder="SEO Page Title"
                autoComplete="off"
                {...field}
                value={field.value ?? ""}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="image"
          render={({ field: { value, onChange }, fieldState }) => {
            const existingImageUrl =
              isEdit && currentRow?.image_url ? currentRow.image_url : null
            const hasNewImage = Array.isArray(value) && value.length > 0

            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="category-image">Image</FieldLabel>
                {existingImageUrl && !hasNewImage && (
                  <div className="mb-3 flex items-center gap-3 rounded-md border p-3">
                    <div className="relative size-16 overflow-hidden rounded-md bg-muted">
                      <ImageZoom>
                        <Image
                          src={existingImageUrl}
                          alt={currentRow?.name ?? "Category image"}
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
    form.setError("image", { message })
  }}
/>
                <FieldDescription>
                  JPEG, PNG, JPG, GIF, or WebP. Max 5MB.
                </FieldDescription>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />

        <Controller
          control={form.control}
          name="icon"
          render={({ field: { value, onChange }, fieldState }) => {
            const existingIconUrl =
              isEdit && currentRow?.icon_url ? currentRow.icon_url : null
            const hasNewIcon = Array.isArray(value) && value.length > 0

            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="category-icon">Icon</FieldLabel>
                {existingIconUrl && !hasNewIcon && (
                  <div className="mb-3 flex items-center gap-3 rounded-md border p-3">
                    <div className="relative size-16 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={existingIconUrl}
                        alt={currentRow?.name ?? "Category icon"}
                        width={64}
                        height={64}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Icon</p>
                      <p className="text-xs text-muted-foreground">
                        Upload a new icon to replace this one
                      </p>
                    </div>
                  </div>
                )}
                <CropperFileUpload
  value={value ?? []}
  onValueChange={onChange}
  accept="image/*"
  maxFiles={1}
  maxSize={2 * 1024 * 1024}
  onFileReject={(_file, message) => {
    form.setError("icon", { message })
  }}
/>
                <FieldDescription>
                  Optional. SVG or image. Max 2MB.
                </FieldDescription>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                <FieldLabel htmlFor="category-active">Active Status</FieldLabel>
                <FieldDescription>
                  Disabling this will hide the category from public view.
                </FieldDescription>
              </div>
              <Switch
                id="category-active"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="featured"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className="flex flex-row items-center justify-between rounded-md border p-4"
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="category-featured">Featured</FieldLabel>
                <FieldDescription>
                  Show this category in featured sections.
                </FieldDescription>
              </div>
              <Switch
                id="category-featured"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="is_sync_disable"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={!!fieldState.error}
              className="flex flex-row items-center justify-between rounded-md border p-4"
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="category-sync">Disable Sync</FieldLabel>
                <FieldDescription>
                  When enabled, this category will not sync to external systems.
                </FieldDescription>
              </div>
              <Switch
                id="category-sync"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
