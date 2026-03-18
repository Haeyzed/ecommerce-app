"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useOptionBrands } from "@/features/products/brands"
import { useOptionCategories } from "@/features/products/categories"
import { useOptionUnits } from "@/features/products/units"
import { useOptionWarehouses } from "@/features/settings/warehouses"
import { useOptionTaxes } from "@/features/settings/taxes"

import {
  useCreateProduct,
  useGenerateProductCode,
  useProduct,
  useUpdateProduct,
} from "../api"
import { productSchema, type ProductFormData } from "../schemas"
import { ProductTypeEnum, type Product } from "../types"
import { ProductForm } from "./products-form"

function parseCsvToNumbers(value?: string | null): number[] {
  if (!value) return []
  return value
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v))
}

function buildEditDefaults(product: Product): ProductFormData {
  const comboProductIds = parseCsvToNumbers(product.product_list)
  const comboVariantIds = parseCsvToNumbers(product.variant_list)
  const comboQtyList = parseCsvToNumbers(product.qty_list)
  const comboPriceList = parseCsvToNumbers(product.price_list)
  const comboWastageList = parseCsvToNumbers(
    product.wastage_percent == null ? null : String(product.wastage_percent)
  )

  return {
    name: product.name,
    code: product.code,
    type: product.type ?? ProductTypeEnum.Standard,
    barcode_symbology: product.barcode_symbology,
    brand_id: product.brand?.id ?? null,
    category_id: product.category?.id ?? 0,
    unit_id: product.unit?.id ?? null,
    purchase_unit_id: product.purchase_unit?.id ?? null,
    sale_unit_id: product.sale_unit?.id ?? null,
    cost: product.cost ?? null,
    price: product.price ?? 0,
    wholesale_price: product.wholesale_price ?? null,
    profit_margin: product.profit_margin ?? null,
    profit_margin_type: (product.profit_margin_type as "percentage" | "fixed" | null) ?? null,
    alert_quantity: product.alert_quantity ?? null,
    daily_sale_objective: product.daily_sale_objective ?? null,
    promotion: product.promotion ?? false,
    promotion_price: product.promotion_price ?? null,
    starting_date: product.starting_date ?? null,
    last_date: product.last_date ?? null,
    tax_id: product.tax?.id ?? null,
    tax_method: product.tax_method ?? null,
    image_paths: [],
    file_path: null,
    is_embeded: product.is_embeded ?? false,
    is_batch: product.is_batch ?? false,
    is_variant: product.is_variant ?? false,
    is_diff_price: product.is_diff_price ?? false,
    is_imei: product.is_imei ?? false,
    featured: product.featured ?? false,
    is_active: product.is_active ?? true,
    is_online: product.is_online ?? false,
    in_stock: product.in_stock ?? false,
    track_inventory: product.track_inventory ?? true,
    is_sync_disable: product.is_sync_disable ?? false,
    is_recipe: product.is_recipe ?? false,
    is_addon: product.is_addon ?? false,
    short_description: product.short_description ?? null,
    tags: product.tags ?? null,
    meta_title: product.meta_title ?? null,
    meta_description: product.meta_description ?? null,
    warranty: product.warranty ?? null,
    guarantee: product.guarantee ?? null,
    warranty_type: product.warranty_type ?? null,
    guarantee_type: product.guarantee_type ?? null,
    production_cost: product.production_cost ?? null,
    variants:
      product.variants?.map((v) => ({
        name: v.variant_name ?? "",
        item_code: v.item_code ?? "",
        additional_cost: v.additional_cost ?? 0,
        additional_price: v.additional_price ?? 0,
      })) ?? [],
    warehouse_prices:
      product.warehouse_prices?.map((w) => ({
        warehouse_id: w.warehouse_id,
        price: Number(w.price ?? 0),
      })) ?? [],
    combo_products: comboProductIds.map((id, index) => ({
      product_id: id,
      product_name: `Product #${id}`,
      variant_id: comboVariantIds[index] ?? null,
      qty: comboQtyList[index] ?? 1,
      price: comboPriceList[index] ?? 0,
      wastage_percent: comboWastageList[index] ?? null,
      combo_unit_id: null,
    })),
    is_initial_stock: false,
    initial_stock: [],
  }
}

export function ProductFormClient({ productId }: { productId?: number }) {
  const router = useRouter()
  const isEdit = !!productId

  const { data: categories = [] } = useOptionCategories()
  const { data: brands = [] } = useOptionBrands()
  const { data: units = [] } = useOptionUnits()
  const { data: warehouses = [] } = useOptionWarehouses()
  const { data: taxes = [] } = useOptionTaxes()
  const { data: generatedCode } = useGenerateProductCode()
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId ?? null)

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      code: "",
      type: ProductTypeEnum.Standard,
      barcode_symbology: "CODE128",
      category_id: 0,
      brand_id: null,
      unit_id: null,
      purchase_unit_id: null,
      sale_unit_id: null,
      cost: null,
      price: 0,
      wholesale_price: null,
      is_active: true,
      featured: false,
      is_online: false,
      in_stock: false,
      track_inventory: true,
      is_sync_disable: false,
      is_embeded: false,
      is_batch: false,
      is_variant: false,
      is_diff_price: false,
      is_imei: false,
      is_recipe: false,
      is_addon: false,
      promotion: false,
      image_paths: [],
      file_path: null,
      variants: [],
      warehouse_prices: [],
      combo_products: [],
      initial_stock: [],
      is_initial_stock: false,
    },
  })

  React.useEffect(() => {
    if (!isEdit && generatedCode && !form.getValues("code")) {
      form.setValue("code", generatedCode)
    }
  }, [generatedCode, form, isEdit])

  React.useEffect(() => {
    if (isEdit && product) {
      form.reset(buildEditDefaults(product))
    }
  }, [form, isEdit, product])

  const onSubmit = (values: ProductFormData) => {
    const options = {
      onSuccess: () => {
        form.reset()
        router.push("/products")
      },
    }

    if (isEdit && productId) {
      updateProduct({ id: productId, data: values }, options)
      return
    }

    createProduct(values, options)
  }

  if (isEdit && isLoadingProduct) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit Product" : "Create Product"}
          </h2>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update product details and save changes."
              : "Create a new product using the API payload structure."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/products")}>
            Cancel
          </Button>
          <Button type="submit" form="product-page-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 size-4" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      <ProductForm
        form={form}
        onSubmit={onSubmit}
        id="product-page-form"
        isEdit={isEdit}
        currentRow={product ?? undefined}
        categories={categories}
        brands={brands}
        units={units}
        warehouses={warehouses}
        taxes={taxes}
      />
    </div>
  )
}

