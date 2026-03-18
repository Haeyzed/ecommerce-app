"use client"

import * as React from "react"
import {
  Controller,
  type FieldPath,
  type UseFormReturn,
  useFieldArray,
  useWatch,
} from "react-hook-form"
import { Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { CropperFileUpload } from "@/components/cropper-file-upload"
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { ProductFormData } from "../schemas"
import type { Product, ProductOption } from "../types"
import { ProductTypeEnum } from "../types"
import {
  productTypeOptions,
  symbologieOptions,
  taxMethodOptions,
} from "@/features/products/products/constants"
import { useComboProductSearch, useSaleUnits } from "../api"

interface ProductFormProps {
  form: UseFormReturn<ProductFormData>
  onSubmit: (data: ProductFormData) => void
  id: string
  isEdit: boolean
  currentRow?: Product
  categories: ProductOption[]
  brands: ProductOption[]
  units: ProductOption[]
  warehouses: ProductOption[]
}

export function ProductForm({
  form,
  onSubmit,
  id,
  isEdit,
  currentRow,
  categories,
  brands,
  units,
  warehouses,
}: ProductFormProps) {
  type ProductFieldPath = FieldPath<ProductFormData>
  const type = useWatch({ control: form.control, name: "type" })
  const isVariant = !!useWatch({ control: form.control, name: "is_variant" })
  const isDiffPrice = !!useWatch({ control: form.control, name: "is_diff_price" })
  const isInitialStock = !!useWatch({
    control: form.control,
    name: "is_initial_stock",
  })
  const promotion = !!useWatch({ control: form.control, name: "promotion" })
  const unitId = useWatch({ control: form.control, name: "unit_id" })

  const [comboKeyword, setComboKeyword] = React.useState("")
  const comboSearch = useComboProductSearch(comboKeyword)
  const saleUnitsQuery = useSaleUnits(unitId ?? null)

  const variantsArray = useFieldArray({
    control: form.control,
    name: "variants",
  })

  const warehousePricesArray = useFieldArray({
    control: form.control,
    name: "warehouse_prices",
  })

  const initialStockArray = useFieldArray({
    control: form.control,
    name: "initial_stock",
  })

  const comboProductsArray = useFieldArray({
    control: form.control,
    name: "combo_products",
  })

  const renderCombobox = (
    name: ProductFieldPath,
    label: string,
    items: readonly { value: string | number; label: string }[],
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
              items={items as { value: string | number; label: string }[]}
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
  const renderFlag = (name: ProductFieldPath, label: string) => (
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

  const addComboProduct = (item: {
    id: number
    name: string
    code: string
    price?: number | null
  }) => {
    const exists = (comboProductsArray.fields ?? []).some(
      (f) => Number(f.product_id) === item.id
    )
    if (exists) return
    comboProductsArray.append({
      product_id: item.id,
      product_name: item.name,
      product_code: item.code,
      variant_id: null,
      variant_name: null,
      qty: 1,
      price: Number(item.price ?? 0),
      wastage_percent: null,
      combo_unit_id: null,
    })
  }

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

          {renderCombobox("type", "Product Type *", productTypeOptions, "Select type")}
          {renderCombobox("barcode_symbology", "Barcode Symbology *", symbologieOptions, "Select symbology")}
          {renderCombobox("category_id", "Category *", categories, "Select category")}
          {renderCombobox("brand_id", "Brand", brands, "Select brand")}
        </FieldGroup>
      </div>

      {(type === ProductTypeEnum.Standard || type === ProductTypeEnum.Combo) && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Units</h3>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {renderCombobox("unit_id", "Product Unit", units, "Select base unit")}
            {renderCombobox(
              "purchase_unit_id",
              "Purchase Unit",
              units,
              "Select purchase unit"
            )}
            {renderCombobox(
              "sale_unit_id",
              "Sale Unit",
              (saleUnitsQuery.data ?? []).map((u) => ({
                value: u.id,
                label: `${u.name} (${u.code})`,
              })),
              "Select sale unit"
            )}
          </FieldGroup>
        </div>
      )}

      {/* Pricing & Inventory */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Pricing & Inventory</h3>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(type === ProductTypeEnum.Standard || type === ProductTypeEnum.Combo) && (
            <Controller
              control={form.control}
              name="cost"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Product Cost</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Product Price <span className="text-destructive">*</span></FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                />
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
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
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
                <NumberField
                  min={0}
                  step={1}
                  value={Number(field.value ?? 0)}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {renderCombobox("tax_method", "Tax Method", taxMethodOptions, "Select tax method")}

          <Controller
            control={form.control}
            name="promotion"
            render={({ field }) => (
              <Field className="flex flex-row items-center justify-between rounded-md border p-3 md:col-span-2">
                <FieldLabel>Promotion</FieldLabel>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />

          {promotion && (
            <>
              <Controller
                control={form.control}
                name="promotion_price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Promotion Price</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="starting_date"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Promotion Start Date</FieldLabel>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(
                          date ? date.toISOString().slice(0, 10) : null
                        )
                      }
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="last_date"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Promotion End Date</FieldLabel>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(
                          date ? date.toISOString().slice(0, 10) : null
                        )
                      }
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </>
          )}
        </FieldGroup>
      </div>

      {isVariant && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-medium">Variants</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                variantsArray.append({
                  name: "",
                  item_code: "",
                  additional_cost: null,
                  additional_price: null,
                })
              }
            >
              <Plus className="mr-1 size-4" />
              Add Variant
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Additional Cost</TableHead>
                  <TableHead>Additional Price</TableHead>
                  <TableHead className="w-[48px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {variantsArray.fields.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No variants added.
                    </TableCell>
                  </TableRow>
                )}
                {variantsArray.fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`variants.${index}.name`}
                        render={({ field }) => <Input {...field} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`variants.${index}.item_code`}
                        render={({ field }) => <Input {...field} value={field.value ?? ""} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`variants.${index}.additional_cost`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === "" ? null : Number(e.target.value)
                              )
                            }
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`variants.${index}.additional_price`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === "" ? null : Number(e.target.value)
                              )
                            }
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => variantsArray.remove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {isDiffPrice && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-medium">Warehouse Prices</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => warehousePricesArray.append({ warehouse_id: 0, price: 0 })}
            >
              <Plus className="mr-1 size-4" />
              Add Row
            </Button>
          </div>
          {warehousePricesArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-3">
              {renderCombobox(
                `warehouse_prices.${index}.warehouse_id` as ProductFieldPath,
                "Warehouse",
                warehouses,
                "Select warehouse"
              )}
              <Controller
                control={form.control}
                name={`warehouse_prices.${index}.price`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Price</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value || 0))}
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => warehousePricesArray.remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === ProductTypeEnum.Combo && (
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-medium">Combo Products</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Search product by name/code..."
              value={comboKeyword}
              onChange={(e) => setComboKeyword(e.target.value)}
            />
            <Button type="button" variant="outline">
              <Search className="mr-1 size-4" />
              Search
            </Button>
          </div>
          {comboKeyword.trim().length > 1 && (
            <div className="max-h-44 overflow-auto rounded-md border">
              {(comboSearch.data ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b px-3 py-2 last:border-b-0"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.code}</div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => addComboProduct(item)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Wastage %</TableHead>
                  <TableHead>Combo Unit</TableHead>
                  <TableHead className="w-[48px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {comboProductsArray.fields.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No combo items selected.
                    </TableCell>
                  </TableRow>
                )}
                {comboProductsArray.fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <div className="font-medium">
                        {(field as unknown as { product_name?: string }).product_name ??
                          `Product #${field.product_id}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(field as unknown as { product_code?: string }).product_code ?? ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`combo_products.${index}.qty`}
                        render={({ field }) => (
                          <NumberField
                            min={0}
                            step={0.01}
                            value={Number(field.value ?? 0)}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <NumberFieldContent>
                              <NumberFieldDecrement />
                              <NumberFieldInput />
                              <NumberFieldIncrement />
                            </NumberFieldContent>
                          </NumberField>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`combo_products.${index}.price`}
                        render={({ field }) => (
                          <NumberField
                            min={0}
                            step={0.01}
                            value={Number(field.value ?? 0)}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <NumberFieldContent>
                              <NumberFieldDecrement />
                              <NumberFieldInput />
                              <NumberFieldIncrement />
                            </NumberFieldContent>
                          </NumberField>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`combo_products.${index}.wastage_percent`}
                        render={({ field }) => (
                          <NumberField
                            min={0}
                            step={0.01}
                            value={Number(field.value ?? 0)}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <NumberFieldContent>
                              <NumberFieldDecrement />
                              <NumberFieldInput />
                              <NumberFieldIncrement />
                            </NumberFieldContent>
                          </NumberField>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={form.control}
                        name={`combo_products.${index}.combo_unit_id`}
                        render={({ field }) => (
                          <Combobox
                            items={units}
                            value={
                              units.find((u) => Number(u.value) === Number(field.value)) ??
                              null
                            }
                            onValueChange={(item) =>
                              field.onChange(item ? Number(item.value) : null)
                            }
                          >
                            <ComboboxTrigger
                              render={
                                <Button
                                  variant="outline"
                                  className="h-8 w-full justify-between font-normal"
                                >
                                  <ComboboxValue placeholder="Unit" />
                                </Button>
                              }
                            />
                            <ComboboxContent>
                              <ComboboxInput showTrigger={false} placeholder="Search..." />
                              <ComboboxEmpty>No units found.</ComboboxEmpty>
                              <ComboboxList>
                                {(item) => (
                                  <ComboboxItem key={String(item.value)} value={item}>
                                    {item.label}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => comboProductsArray.remove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Description & SEO */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Details & SEO</h3>
        <FieldGroup className="space-y-4">
          <Controller
            control={form.control}
            name="product_details"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Product Details</FieldLabel>
                <SimpleEditor
                  value={
                    typeof field.value === "object" && field.value && "html" in field.value
                      ? String((field.value as { html?: string }).html ?? "")
                      : ""
                  }
                  onChange={(html) => field.onChange({ html })}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="specification"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Specification</FieldLabel>
                <SimpleEditor
                  value={
                    typeof field.value === "object" && field.value && "html" in field.value
                      ? String((field.value as { html?: string }).html ?? "")
                      : ""
                  }
                  onChange={(html) => field.onChange({ html })}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
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

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Media</h3>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="image_paths"
            render={({ field: { value, onChange }, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Images</FieldLabel>
                <CropperFileUpload
                  value={value ?? []}
                  onValueChange={onChange}
                  accept="image/*"
                  maxFiles={10}
                  maxSize={5 * 1024 * 1024}
                  multiple
                  onFileReject={(_file, message) => {
                    form.setError("image_paths", { message })
                  }}
                />
                {isEdit && currentRow?.image_urls?.length ? (
                  <FieldDescription>
                    Existing images: {currentRow.image_urls.length}
                  </FieldDescription>
                ) : null}
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="file_path"
            render={({ field: { value, onChange }, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>Attachment</FieldLabel>
                <FileUpload
                  value={value ? [value] : []}
                  onValueChange={(files) => onChange(files[0] ?? null)}
                  maxFiles={1}
                  maxSize={20 * 1024 * 1024}
                >
                  <FileUploadDropzone className="flex flex-row flex-wrap border-dotted text-center">
                    Drag and drop or{" "}
                    <FileUploadTrigger asChild>
                      <Button variant="link" size="sm" className="p-0">
                        choose file
                      </Button>
                    </FileUploadTrigger>{" "}
                    to upload
                  </FileUploadDropzone>
                  <FileUploadList>
                    {(value ? [value] : []).map((file) => (
                      <FileUploadItem key={file.name} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button type="button" variant="ghost" size="icon">
                            <Trash2 className="size-4" />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      {!isEdit && (
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-medium">Initial Stock</h3>
          {renderFlag("is_initial_stock", "Add initial stock on create")}
          {isInitialStock && (
            <div className="space-y-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => initialStockArray.append({ warehouse_id: 0, qty: 0 })}
              >
                <Plus className="mr-1 size-4" />
                Add Stock Row
              </Button>
              {initialStockArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-3"
                >
                  {renderCombobox(
                    `initial_stock.${index}.warehouse_id` as ProductFieldPath,
                    "Warehouse",
                    warehouses,
                    "Select warehouse"
                  )}
                  <Controller
                    control={form.control}
                    name={`initial_stock.${index}.qty`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>Quantity</FieldLabel>
                        <NumberField
                          min={0}
                          step={0.01}
                          value={Number(field.value ?? 0)}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                          </NumberFieldContent>
                        </NumberField>
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => initialStockArray.remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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