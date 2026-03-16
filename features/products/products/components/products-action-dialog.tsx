"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { useCreateProduct, useUpdateProduct } from "../api"
import { productSchema, type ProductFormData } from "../schemas"
import type { Product } from "../types"
import { ProductTypeEnum } from "../types"
import { ProductForm } from "./products-form"
import { useOptionCategories } from "../../categories"
import { useOptionBrands } from "../../brands"
import { useOptionUnits } from "../../units"

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

  // Fetch options for Comboboxes
  const { data: categories = [] } = useOptionCategories()
  const { data: brands = [] } = useOptionBrands()
  const { data: units = [] } = useOptionUnits()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: isEdit && currentRow
      ? {
        name: currentRow.name,
        code: currentRow.code,
        type: currentRow.type || ProductTypeEnum.Standard,
        barcode_symbology: currentRow.barcode_symbology || "CODE128",
        category_id: currentRow.category?.id || 0,
        brand_id: currentRow.brand?.id || null,
        unit_id: currentRow.unit?.id || null,
        purchase_unit_id: currentRow.purchase_unit?.id || null,
        sale_unit_id: currentRow.sale_unit?.id || null,
        cost: currentRow.cost || undefined,
        price: currentRow.price || 0,
        wholesale_price: currentRow.wholesale_price || undefined,
        alert_quantity: currentRow.alert_quantity || undefined,
        tax_method: currentRow.tax_method || undefined,
        short_description: currentRow.short_description || "",
        meta_title: currentRow.meta_title || "",
        image_paths: [],
        file_path: null,
        // Flags
        is_active: currentRow.is_active,
        featured: currentRow.featured,
        is_online: currentRow.is_online,
        in_stock: currentRow.in_stock,
        track_inventory: currentRow.track_inventory,
        is_sync_disable: currentRow.is_sync_disable,
        is_embeded: currentRow.is_embeded,
        is_batch: currentRow.is_batch,
        is_variant: currentRow.is_variant,
        is_diff_price: currentRow.is_diff_price,
        is_imei: currentRow.is_imei,
        is_recipe: currentRow.is_recipe,
        is_addon: currentRow.is_addon,
      }
      : {
        name: "",
        code: "",
        type: ProductTypeEnum.Standard,
        barcode_symbology: "CODE128",
        category_id: 0,
        brand_id: null,
        unit_id: null,
        purchase_unit_id: null,
        sale_unit_id: null,
        price: 0,
        short_description: "",
        meta_title: "",
        image_paths: [],
        file_path: null,
        // Flags default to true/false
        is_active: true,
        featured: false,
        is_online: true,
        in_stock: true,
        track_inventory: true,
        is_sync_disable: false,
        is_embeded: false,
        is_batch: false,
        is_variant: false,
        is_diff_price: false,
        is_imei: false,
        is_recipe: false,
        is_addon: false,
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
      <ResponsiveDialogContent className="sm:max-w-3xl">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>
            {isEdit ? "Edit Product" : "Add New Product"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit
              ? "Update the comprehensive product details here. "
              : "Create a new product by filling out the details below. "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {/* Added h-max & overflow for large form scrolling */}
        <ResponsiveDialogBody className="py-2 pe-3 max-h-[70vh] overflow-y-auto">
          <ProductForm
            form={form}
            onSubmit={onSubmit}
            id="product-form"
            isEdit={isEdit}
            currentRow={currentRow}
            categories={categories}
            brands={brands}
            units={units}
          />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter className="pt-4 border-t">
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