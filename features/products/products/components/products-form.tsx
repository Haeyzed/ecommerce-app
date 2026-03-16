"use client"

import * as React from "react"
import Image from "next/image"
import { Controller, type UseFormReturn } from "react-hook-form"
import { CloudUpload, X } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { CropperFileUpload } from "@/components/cropper-file-upload"

import type { ProductFormData } from "../schemas"
import type { Product, ProductOption } from "../types"
import { ProductTypeEnum, TaxMethodEnum } from "../types"

interface ProductFormProps {
  form: UseFormReturn<ProductFormData>
  onSubmit: (data: ProductFormData) => void
  id: string
  isEdit: boolean
  currentRow?: Product
  categories: ProductOption[]
  brands: ProductOption[]
  units: ProductOption[]
}

const productTypes = [
  { value: ProductTypeEnum.Standard, label: "Standard" },
  { value: ProductTypeEnum.Combo, label: "Combo" },
  { value: ProductTypeEnum.Digital, label: "Digital" },
  { value: ProductTypeEnum.Service, label: "Service" },
]

const symbologies = [
  { value: "CODE128", label: "Code 128" },
  { value: "CODE39", label: "Code 39" },
  { value: "UPCA", label: "UPC-A" },
  { value: "UPCE", label: "UPC-E" },
  { value: "EAN8", label: "EAN-8" },
  { value: "EAN13", label: "EAN-13" },
]

const taxMethods = [
  { value: TaxMethodEnum.Exclusive, label: "Exclusive" },
  { value: TaxMethodEnum.Inclusive, label: "Inclusive" },
]

export function ProductForm({
                              form,
                              onSubmit,
                              id,
                              isEdit,
                              currentRow,
                              categories,
                              brands,
                              units,
                            }: ProductFormProps) {
  const { theme } = useTheme()

  // Helper for rendering a Combobox field cleanly
  const renderCombobox = (
    name: keyof ProductFormData,
    label: string,
    items: { value: string | number; label: string }[],
    placeholder: string
  ) => (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedItem =
          items.find((item) => item.value === field.value) || null

        return (
          <Field data-invalid={!!fieldState.error} className="flex flex-col">
            <FieldLabel>{label}</FieldLabel>
            <Combobox
              items={items}
              value={selectedItem}
              onValueChange={(item) => field.onChange(item?.value ?? null)}
            >
              <ComboboxTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    <ComboboxValue placeholder={placeholder} />
                  </Button>
                }
              />
              <ComboboxContent>
                <ComboboxInput showTrigger={false} placeholder="Search..." />
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={String(item.value)} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )

  // Helper for rendering boolean switch flags
  const renderFlag = (name: keyof ProductFormData, label: string) => (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={!!fieldState.error}
          className="flex flex-row items-center justify-between rounded-md border p-3"
        >
          <div className="space-y-0.5">
            <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
          </div>
          <Switch
            checked={!!field.value}
            onCheckedChange={field.onChange}
          />
        </Field>
      )}
    />
  )

  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Basic Info</h3>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className="md:col-span-2">
                <FieldLabel>Name <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="Product name" autoComplete="off" {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Product Code <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="E.g., PRD-001" autoComplete="off" {...field} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {renderCombobox("type", "Product Type *", productTypes, "Select type")}
          {renderCombobox("barcode_symbology", "Barcode Symbology *", symbologies, "Select symbology")}
          {renderCombobox("category_id", "Category *", categories, "Select category")}
          {renderCombobox("brand_id", "Brand", brands, "Select brand")}
        </FieldGroup>
      </div>

      {/* Units */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Units</h3>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {renderCombobox("unit_id", "Product Unit", units, "Select base unit")}
          {renderCombobox("purchase_unit_id", "Purchase Unit", units, "Select purchase unit")}
          {renderCombobox("sale_unit_id", "Sale Unit", units, "Select sale unit")}
        </FieldGroup>
      </div>

      {/* Pricing & Inventory */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Pricing & Inventory</h3>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="cost"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Product Cost</FieldLabel>
                <Input type="number" step="0.01" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || undefined)} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Product Price <span className="text-destructive">*</span></FieldLabel>
                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="wholesale_price"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Wholesale Price</FieldLabel>
                <Input type="number" step="0.01" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || undefined)} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="alert_quantity"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Alert Quantity</FieldLabel>
                <Input type="number" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || undefined)} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {renderCombobox("tax_method", "Tax Method", taxMethods, "Select tax method")}
        </FieldGroup>
      </div>

      {/* Description & SEO */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Details & SEO</h3>
        <FieldGroup className="space-y-4">
          <Controller
            control={form.control}
            name="short_description"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Short Description</FieldLabel>
                <Textarea rows={3} className="resize-none" {...field} value={field.value ?? ""} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="meta_title"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Meta Title</FieldLabel>
                <Input {...field} value={field.value ?? ""} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Media</h3>
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Images */}
          <Controller
            control={form.control}
            name="image_paths"
            render={({ field: { value, onChange }, fieldState }) => {
              const existingImageUrl =
                isEdit && currentRow?.image_urls?.[0] ? currentRow.image_urls[0] : null
              const hasNewImage = Array.isArray(value) && value.length > 0

              return (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Product Image</FieldLabel>
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
                        <p className="text-xs text-muted-foreground">Upload a new image to replace</p>
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
                      form.setError("image_paths", { message })
                    }}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />

          {/* File Document */}
          <Controller
            control={form.control}
            name="file_path"
            render={({ field: { value, onChange }, fieldState }) => {
              const existingFileUrl = isEdit && currentRow?.file_url ? currentRow.file_url : null
              const hasNewFile = value instanceof File

              return (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Attachment File</FieldLabel>

                  {existingFileUrl && !hasNewFile && (
                    <div className="mb-3 flex items-center gap-3 rounded-md border p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Current File Exists</p>
                        <a href={existingFileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                          View File
                        </a>
                      </div>
                    </div>
                  )}

                  <FileUpload
                    value={value ? [value] : []}
                    onValueChange={(files) => onChange(files?.[0] || null)}
                    accept="application/pdf,.csv,.doc,.docx"
                    maxFiles={1}
                    maxSize={10 * 1024 * 1024}
                    onFileReject={(_, message) => {
                      form.setError("file_path", { message })
                    }}
                  >
                    <FileUploadDropzone className="flex flex-col items-center justify-center gap-2 border-dashed p-8 text-center">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <CloudUpload className="size-5" />
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        <br />
                        <span className="text-muted-foreground">Document (max 10MB)</span>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button variant="link" size="sm" className="sr-only">Select file</Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>
                    <FileUploadList>
                      {(value ? [value] : []).map((file, index) => (
                        <FileUploadItem key={index} value={file} className="w-full">
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata className="ml-2 flex-1" />
                          <FileUploadItemDelete asChild>
                            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive">
                              <span className="sr-only">Remove</span>
                              <X className="size-4" />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </div>

      {/* Flags & Toggles */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Configuration Flags</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {renderFlag("is_active", "Active")}
          {renderFlag("featured", "Featured")}
          {renderFlag("is_online", "Sell Online")}
          {renderFlag("in_stock", "In Stock")}
          {renderFlag("track_inventory", "Track Inventory")}
          {renderFlag("is_sync_disable", "Disable Sync")}
          {renderFlag("is_embeded", "Is Embedded")}
          {renderFlag("is_batch", "Batch Tracking")}
          {renderFlag("is_variant", "Has Variants")}
          {renderFlag("is_diff_price", "Different Price")}
          {renderFlag("is_imei", "Requires IMEI")}
          {renderFlag("is_recipe", "Is Recipe")}
          {renderFlag("is_addon", "Is Addon")}
        </div>
      </div>
    </form>
  )
}