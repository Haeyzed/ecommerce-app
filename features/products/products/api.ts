"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useApiClient } from "@/lib/api/use-api-client"
import { ValidationError } from "@/lib/api/errors"

import type {
  ComboSearchItem,
  Product,
  ProductExportParams,
  ProductFormData,
  ProductListParams,
  ProductOption,
  UnitSaleOption,
} from "./types"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  options: () => [...productKeys.all, "options"] as const,
  search: (keyword: string, warehouseId?: number) =>
    [...productKeys.all, "search", keyword, warehouseId] as const,
  comboSearch: (keyword: string, warehouseId?: number) =>
    [...productKeys.all, "combo-search", keyword, warehouseId] as const,
  saleUnits: (unitId: number) => [...productKeys.all, "sale-units", unitId] as const,
  generatedCode: () => [...productKeys.all, "generated-code"] as const,
}

const BASE_PATH = "/products"

function toApiParams(
  params?: ProductListParams
): Record<string, string | number | boolean | null | undefined> {
  if (!params) return {}
  const out: Record<string, string | number | boolean | null | undefined> = {}
  if (params.page != null) out.page = params.page
  if (params.per_page != null) out.per_page = params.per_page
  if (params.search != null && params.search !== "") out.search = params.search

  if (params.is_active != null && params.is_active.length > 0) {
    out.is_active = params.is_active.map((v) => (v ? 1 : 0)).join(",")
  }
  if (params.featured != null && params.featured.length > 0) {
    out.featured = params.featured.map((v) => (v ? 1 : 0)).join(",")
  }
  if (params.type != null && params.type.length > 0) {
    out.type = params.type.join(",")
  }
  if (params.brand_id != null && params.brand_id.length > 0) {
    out.brand_id = params.brand_id.join(",")
  }
  if (params.category_id != null && params.category_id.length > 0) {
    out.category_id = params.category_id.join(",")
  }
  if (params.unit_id != null && params.unit_id.length > 0) {
    out.unit_id = params.unit_id.join(",")
  }
  if (params.warehouse_id != null) out.warehouse_id = params.warehouse_id
  if (params.stock_filter != null) out.stock_filter = params.stock_filter

  return out
}

export function useProducts(params?: ProductListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      return await api.get<Product[]>(BASE_PATH, {
        params: toApiParams(params),
      })
    },
    enabled: sessionStatus !== "loading",
  })
  return {
    ...query,
    data: query.data?.data ?? null,
    meta: query.data?.meta,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useOptionProducts() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: productKeys.options(),
    queryFn: async () => {
      const response = await api.get<ProductOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useGenerateProductCode() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: productKeys.generatedCode(),
    queryFn: async () => {
      const response = await api.get<{ code: string }>(`${BASE_PATH}/generate-code`)
      return response.data?.code ?? ""
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useProductSearch(keyword: string, warehouseId?: number) {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: productKeys.search(keyword, warehouseId),
    queryFn: async () => {
      const response = await api.get<ComboSearchItem[]>(`${BASE_PATH}/search`, {
        params: {
          keyword,
          warehouse_id: warehouseId,
        },
      })
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading" && keyword.trim().length > 1,
  })
}

export function useComboProductSearch(keyword: string, warehouseId?: number) {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: productKeys.comboSearch(keyword, warehouseId),
    queryFn: async () => {
      const response = await api.get<ComboSearchItem[]>(`${BASE_PATH}/combo-search`, {
        params: {
          keyword,
          warehouse_id: warehouseId,
        },
      })
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading" && keyword.trim().length > 1,
  })
}

export function useSaleUnits(unitId: number | null) {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: productKeys.saleUnits(unitId ?? 0),
    queryFn: async () => {
      if (!unitId) return []
      const response = await api.get<UnitSaleOption[]>(`${BASE_PATH}/sale-unit/${unitId}`)
      return response.data ?? []
    },
    enabled: !!unitId && sessionStatus !== "loading",
  })
}

export function useProduct(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<Product>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== "loading",
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useCreateProduct() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData()

      // Basic Info
      formData.append("name", data.name)
      formData.append("code", data.code)
      formData.append("type", data.type)
      formData.append("barcode_symbology", data.barcode_symbology)

      // Relationships
      if (data.brand_id) formData.append("brand_id", String(data.brand_id))
      if (data.category_id)
        formData.append("category_id", String(data.category_id))
      if (data.unit_id) formData.append("unit_id", String(data.unit_id))
      if (data.purchase_unit_id)
        formData.append("purchase_unit_id", String(data.purchase_unit_id))
      if (data.sale_unit_id)
        formData.append("sale_unit_id", String(data.sale_unit_id))

      // Pricing
      if (data.cost !== undefined && data.cost !== null)
        formData.append("cost", String(data.cost))
      formData.append("price", String(data.price))
      if (data.wholesale_price !== undefined && data.wholesale_price !== null)
        formData.append("wholesale_price", String(data.wholesale_price))
      if (data.profit_margin !== undefined && data.profit_margin !== null)
        formData.append("profit_margin", String(data.profit_margin))
      if (data.profit_margin_type)
        formData.append("profit_margin_type", data.profit_margin_type)

      // Inventory
      if (data.alert_quantity !== undefined && data.alert_quantity !== null)
        formData.append("alert_quantity", String(data.alert_quantity))
      if (
        data.daily_sale_objective !== undefined &&
        data.daily_sale_objective !== null
      )
        formData.append(
          "daily_sale_objective",
          String(data.daily_sale_objective)
        )

      // Promotion
      if (data.promotion !== undefined && data.promotion !== null)
        formData.append("promotion", data.promotion ? "1" : "0")
      if (data.promotion_price !== undefined && data.promotion_price !== null)
        formData.append("promotion_price", String(data.promotion_price))
      if (data.starting_date)
        formData.append("starting_date", data.starting_date)
      if (data.last_date) formData.append("last_date", data.last_date)

      // Tax
      if (data.tax_id) formData.append("tax_id", String(data.tax_id))
      if (data.tax_method !== undefined && data.tax_method !== null)
        formData.append("tax_method", String(data.tax_method))

      // Images
      const imageFiles = data.image_paths
      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`image_paths[${index}]`, file)
          }
        })
      }

      // File
      if (data.file_path instanceof File) {
        formData.append("file_path", data.file_path)
      }

      // Flags
      if (data.is_embeded !== undefined && data.is_embeded !== null)
        formData.append("is_embeded", data.is_embeded ? "1" : "0")
      if (data.is_batch !== undefined && data.is_batch !== null)
        formData.append("is_batch", data.is_batch ? "1" : "0")
      if (data.is_variant !== undefined && data.is_variant !== null)
        formData.append("is_variant", data.is_variant ? "1" : "0")
      if (data.is_diff_price !== undefined && data.is_diff_price !== null)
        formData.append("is_diff_price", data.is_diff_price ? "1" : "0")
      if (data.is_imei !== undefined && data.is_imei !== null)
        formData.append("is_imei", data.is_imei ? "1" : "0")
      if (data.featured !== undefined && data.featured !== null)
        formData.append("featured", data.featured ? "1" : "0")
      if (data.is_active !== undefined && data.is_active !== null)
        formData.append("is_active", data.is_active ? "1" : "0")
      if (data.is_online !== undefined && data.is_online !== null)
        formData.append("is_online", data.is_online ? "1" : "0")
      if (data.in_stock !== undefined && data.in_stock !== null)
        formData.append("in_stock", data.in_stock ? "1" : "0")
      if (data.track_inventory !== undefined && data.track_inventory !== null)
        formData.append("track_inventory", data.track_inventory ? "1" : "0")
      if (data.is_sync_disable !== undefined && data.is_sync_disable !== null)
        formData.append("is_sync_disable", data.is_sync_disable ? "1" : "0")
      if (data.is_recipe !== undefined && data.is_recipe !== null)
        formData.append("is_recipe", data.is_recipe ? "1" : "0")
      if (data.is_addon !== undefined && data.is_addon !== null)
        formData.append("is_addon", data.is_addon ? "1" : "0")

      // Details
      if (data.product_details)
        formData.append("product_details", JSON.stringify(data.product_details))
      if (data.short_description)
        formData.append("short_description", data.short_description)
      if (data.specification)
        formData.append("specification", JSON.stringify(data.specification))

      // Related Data
      if (data.related_products?.length) {
        data.related_products.forEach((id, index) => {
          formData.append(`related_products[${index}]`, String(id))
        })
      }
      if (data.extras?.length) {
        data.extras.forEach((item, index) => {
          formData.append(`extras[${index}]`, item)
        })
      }
      if (data.menu_type?.length) {
        data.menu_type.forEach((item, index) => {
          formData.append(`menu_type[${index}]`, item)
        })
      }
      if (data.kitchen_id)
        formData.append("kitchen_id", String(data.kitchen_id))

      // WooCommerce
      if (data.woocommerce_product_id)
        formData.append(
          "woocommerce_product_id",
          String(data.woocommerce_product_id)
        )
      if (data.woocommerce_media_id)
        formData.append(
          "woocommerce_media_id",
          String(data.woocommerce_media_id)
        )

      // SEO
      if (data.tags) formData.append("tags", data.tags)
      if (data.meta_title) formData.append("meta_title", data.meta_title)
      if (data.meta_description)
        formData.append("meta_description", data.meta_description)

      // Warranty & Guarantee
      if (data.warranty) formData.append("warranty", String(data.warranty))
      if (data.guarantee) formData.append("guarantee", String(data.guarantee))
      if (data.warranty_type)
        formData.append("warranty_type", data.warranty_type)
      if (data.guarantee_type)
        formData.append("guarantee_type", data.guarantee_type)

      // Combo & Production
      if (data.wastage_percent !== undefined && data.wastage_percent !== null)
        formData.append("wastage_percent", String(data.wastage_percent))
      if (data.combo_unit_id)
        formData.append("combo_unit_id", String(data.combo_unit_id))
      if (data.production_cost !== undefined && data.production_cost !== null)
        formData.append("production_cost", String(data.production_cost))

      // Structured Arrays
      if (data.variants?.length) {
        data.variants.forEach((variant, index) => {
          formData.append(`variants[${index}][name]`, variant.name)
          if (variant.item_code)
            formData.append(`variants[${index}][item_code]`, variant.item_code)
          if (
            variant.additional_cost !== undefined &&
            variant.additional_cost !== null
          )
            formData.append(
              `variants[${index}][additional_cost]`,
              String(variant.additional_cost)
            )
          if (
            variant.additional_price !== undefined &&
            variant.additional_price !== null
          )
            formData.append(
              `variants[${index}][additional_price]`,
              String(variant.additional_price)
            )
        })
      }

      if (data.warehouse_prices?.length) {
        data.warehouse_prices.forEach((price, index) => {
          formData.append(
            `warehouse_prices[${index}][warehouse_id]`,
            String(price.warehouse_id)
          )
          formData.append(
            `warehouse_prices[${index}][price]`,
            String(price.price)
          )
        })
      }

      if (data.combo_products?.length) {
        data.combo_products.forEach((combo, index) => {
          formData.append(
            `combo_products[${index}][product_id]`,
            String(combo.product_id)
          )
          if (combo.variant_id !== undefined && combo.variant_id !== null)
            formData.append(
              `combo_products[${index}][variant_id]`,
              String(combo.variant_id)
            )
          formData.append(`combo_products[${index}][qty]`, String(combo.qty))
          formData.append(
            `combo_products[${index}][price]`,
            String(combo.price)
          )
          if (combo.wastage_percent !== undefined && combo.wastage_percent !== null)
            formData.append(
              `combo_products[${index}][wastage_percent]`,
              String(combo.wastage_percent)
            )
          if (combo.combo_unit_id !== undefined && combo.combo_unit_id !== null)
            formData.append(
              `combo_products[${index}][combo_unit_id]`,
              String(combo.combo_unit_id)
            )
        })
      }

      if (data.is_initial_stock && data.initial_stock?.length) {
        formData.append("is_initial_stock", "1")
        data.initial_stock.forEach((stock, index) => {
          formData.append(
            `initial_stock[${index}][warehouse_id]`,
            String(stock.warehouse_id)
          )
          formData.append(`initial_stock[${index}][qty]`, String(stock.qty))
        })
      }

      const response = await api.post<{ data: Product }>(BASE_PATH, formData)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message || "Product created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product")
    },
  })
}

export function useUpdateProduct() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<ProductFormData>
    }) => {
      const formData = new FormData()
      formData.append("_method", "PUT")

      // Basic Info
      if (data.name) formData.append("name", data.name)
      if (data.code) formData.append("code", data.code)
      if (data.type) formData.append("type", data.type)
      if (data.barcode_symbology)
        formData.append("barcode_symbology", data.barcode_symbology)

      // Relationships
      if (data.brand_id) formData.append("brand_id", String(data.brand_id))
      if (data.category_id)
        formData.append("category_id", String(data.category_id))
      if (data.unit_id) formData.append("unit_id", String(data.unit_id))
      if (data.purchase_unit_id)
        formData.append("purchase_unit_id", String(data.purchase_unit_id))
      if (data.sale_unit_id)
        formData.append("sale_unit_id", String(data.sale_unit_id))

      // Pricing
      if (data.cost !== undefined)
        formData.append(
          "cost",
          data.cost !== null && data.cost !== undefined ? String(data.cost) : ""
        )
      if (data.price !== undefined) formData.append("price", String(data.price))
      if (data.wholesale_price !== undefined)
        formData.append(
          "wholesale_price",
          data.wholesale_price !== null && data.wholesale_price !== undefined
            ? String(data.wholesale_price)
            : ""
        )
      if (data.profit_margin !== undefined)
        formData.append(
          "profit_margin",
          data.profit_margin !== null && data.profit_margin !== undefined
            ? String(data.profit_margin)
            : ""
        )
      if (data.profit_margin_type)
        formData.append("profit_margin_type", data.profit_margin_type)

      // Inventory
      if (data.alert_quantity !== undefined)
        formData.append(
          "alert_quantity",
          data.alert_quantity !== null && data.alert_quantity !== undefined
            ? String(data.alert_quantity)
            : ""
        )
      if (data.daily_sale_objective !== undefined)
        formData.append(
          "daily_sale_objective",
          data.daily_sale_objective !== null &&
          data.daily_sale_objective !== undefined
            ? String(data.daily_sale_objective)
            : ""
        )

      // Promotion
      if (data.promotion !== undefined)
        formData.append("promotion", data.promotion ? "1" : "0")
      if (data.promotion_price !== undefined)
        formData.append(
          "promotion_price",
          data.promotion_price !== null && data.promotion_price !== undefined
            ? String(data.promotion_price)
            : ""
        )
      if (data.starting_date)
        formData.append("starting_date", data.starting_date)
      if (data.last_date) formData.append("last_date", data.last_date)

      // Tax
      if (data.tax_id) formData.append("tax_id", String(data.tax_id))
      if (data.tax_method !== undefined)
        formData.append(
          "tax_method",
          data.tax_method !== null && data.tax_method !== undefined
            ? String(data.tax_method)
            : ""
        )

      // Images (new uploads)
      const imageFiles = data.image_paths
      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`image_paths[${index}]`, file)
          }
        })
      }

      // File
      if (data.file_path instanceof File) {
        formData.append("file_path", data.file_path)
      }

      // Flags
      if (data.is_embeded !== undefined)
        formData.append("is_embeded", data.is_embeded ? "1" : "0")
      if (data.is_batch !== undefined)
        formData.append("is_batch", data.is_batch ? "1" : "0")
      if (data.is_variant !== undefined)
        formData.append("is_variant", data.is_variant ? "1" : "0")
      if (data.is_diff_price !== undefined)
        formData.append("is_diff_price", data.is_diff_price ? "1" : "0")
      if (data.is_imei !== undefined)
        formData.append("is_imei", data.is_imei ? "1" : "0")
      if (data.featured !== undefined)
        formData.append("featured", data.featured ? "1" : "0")
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0")
      if (data.is_online !== undefined)
        formData.append("is_online", data.is_online ? "1" : "0")
      if (data.in_stock !== undefined)
        formData.append("in_stock", data.in_stock ? "1" : "0")
      if (data.track_inventory !== undefined)
        formData.append("track_inventory", data.track_inventory ? "1" : "0")
      if (data.is_sync_disable !== undefined)
        formData.append("is_sync_disable", data.is_sync_disable ? "1" : "0")
      if (data.is_recipe !== undefined)
        formData.append("is_recipe", data.is_recipe ? "1" : "0")
      if (data.is_addon !== undefined)
        formData.append("is_addon", data.is_addon ? "1" : "0")

      // Details
      if (data.product_details)
        formData.append("product_details", JSON.stringify(data.product_details))
      if (data.short_description)
        formData.append("short_description", data.short_description)
      if (data.specification)
        formData.append("specification", JSON.stringify(data.specification))

      // Related Data
      if (data.related_products?.length) {
        data.related_products.forEach((id, index) => {
          formData.append(`related_products[${index}]`, String(id))
        })
      }
      if (data.extras?.length) {
        data.extras.forEach((item, index) => {
          formData.append(`extras[${index}]`, item)
        })
      }
      if (data.menu_type?.length) {
        data.menu_type.forEach((item, index) => {
          formData.append(`menu_type[${index}]`, item)
        })
      }
      if (data.kitchen_id)
        formData.append("kitchen_id", String(data.kitchen_id))

      // WooCommerce
      if (data.woocommerce_product_id)
        formData.append(
          "woocommerce_product_id",
          String(data.woocommerce_product_id)
        )
      if (data.woocommerce_media_id)
        formData.append(
          "woocommerce_media_id",
          String(data.woocommerce_media_id)
        )

      // SEO
      if (data.tags) formData.append("tags", data.tags)
      if (data.meta_title) formData.append("meta_title", data.meta_title)
      if (data.meta_description)
        formData.append("meta_description", data.meta_description)

      // Warranty & Guarantee
      if (data.warranty) formData.append("warranty", String(data.warranty))
      if (data.guarantee) formData.append("guarantee", String(data.guarantee))
      if (data.warranty_type)
        formData.append("warranty_type", data.warranty_type)
      if (data.guarantee_type)
        formData.append("guarantee_type", data.guarantee_type)

      // Combo & Production
      if (data.wastage_percent !== undefined && data.wastage_percent !== null)
        formData.append("wastage_percent", String(data.wastage_percent))
      if (data.combo_unit_id)
        formData.append("combo_unit_id", String(data.combo_unit_id))
      if (data.production_cost !== undefined && data.production_cost !== null)
        formData.append("production_cost", String(data.production_cost))

      // Structured Arrays
      if (data.variants?.length) {
        data.variants.forEach((variant, index) => {
          formData.append(`variants[${index}][name]`, variant.name)
          if (variant.item_code)
            formData.append(`variants[${index}][item_code]`, variant.item_code)
          if (
            variant.additional_cost !== undefined &&
            variant.additional_cost !== null
          )
            formData.append(
              `variants[${index}][additional_cost]`,
              String(variant.additional_cost)
            )
          if (
            variant.additional_price !== undefined &&
            variant.additional_price !== null
          )
            formData.append(
              `variants[${index}][additional_price]`,
              String(variant.additional_price)
            )
        })
      }

      if (data.warehouse_prices?.length) {
        data.warehouse_prices.forEach((price, index) => {
          formData.append(
            `warehouse_prices[${index}][warehouse_id]`,
            String(price.warehouse_id)
          )
          formData.append(
            `warehouse_prices[${index}][price]`,
            String(price.price)
          )
        })
      }

      if (data.combo_products?.length) {
        data.combo_products.forEach((combo, index) => {
          formData.append(
            `combo_products[${index}][product_id]`,
            String(combo.product_id)
          )
          if (combo.variant_id !== undefined && combo.variant_id !== null)
            formData.append(
              `combo_products[${index}][variant_id]`,
              String(combo.variant_id)
            )
          formData.append(`combo_products[${index}][qty]`, String(combo.qty))
          formData.append(
            `combo_products[${index}][price]`,
            String(combo.price)
          )
          if (combo.wastage_percent !== undefined && combo.wastage_percent !== null)
            formData.append(
              `combo_products[${index}][wastage_percent]`,
              String(combo.wastage_percent)
            )
          if (combo.combo_unit_id !== undefined && combo.combo_unit_id !== null)
            formData.append(
              `combo_products[${index}][combo_unit_id]`,
              String(combo.combo_unit_id)
            )
        })
      }

      if (data.deleted_image_paths?.length) {
        data.deleted_image_paths.forEach((path, index) => {
          formData.append(`deleted_image_paths[${index}]`, path)
        })
      }

      const response = await api.post<{ data: Product }>(
        `${BASE_PATH}/${id}`,
        formData
      )
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return { id, message: response.message }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) })
      toast.success(data.message || "Product updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product")
    },
  })
}

export function useDeleteProduct() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<unknown>(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateProducts() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeactivateProducts() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeleteProducts() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ deleted_count: number }>(
        `${BASE_PATH}/bulk-destroy`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useProductsImport() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append("file", file)
      const response = await api.post<unknown>(`${BASE_PATH}/import`, form)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useProductsExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: ProductExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `products-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return { message: "Export downloaded successfully" }
      }
      const response = await api.post<unknown>(`${BASE_PATH}/export`, params)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useProductsTemplateDownload() {
  const { api } = useApiClient()
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "products-sample.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      return { message: "Sample template downloaded" }
    },
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
