// Enums
export enum ProductTypeEnum {
  Standard = "standard",
  Combo = "combo",
  Digital = "digital",
  Service = "service",
}

export enum TaxMethodEnum {
  Inclusive = 0,
  Exclusive = 1,
}

// Relationships
export interface Brand {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
}

export interface Unit {
  id: number
  name: string
  code: string
}

export interface Kitchen {
  id: number
  name: string
}

export interface Tax {
  id: number
  name: string
  rate: number
}

export interface ProductVariant {
  id: number
  variant_id: number
  variant_name: string | null
  item_code: string
  additional_cost: number
  additional_price: number
  qty: number
  position: number
}

export interface ProductWarehousePrice {
  warehouse_id: number
  price: number | null
}

export interface ProductWarehouseStock {
  warehouse_id: number
  warehouse_name?: string | null
  qty: number
}

// Main Product Type
export interface Product {
  id: number
  name: string
  code: string
  type: ProductTypeEnum
  slug: string | null
  barcode_symbology: string
  brand?: Brand | null
  category?: Category | null
  unit?: Unit | null
  purchase_unit?: Unit | null
  sale_unit?: Unit | null
  combo_unit?: Unit | null
  kitchen?: Kitchen | null
  tax?: Tax | null
  cost: number
  profit_margin: number | null
  profit_margin_type: string | null
  price: number
  wholesale_price: number | null
  qty: number | null
  alert_quantity: number | null
  daily_sale_objective: number | null
  promotion: boolean
  promotion_price: number | null
  starting_date: string | null
  last_date: string | null
  tax_method: number | null
  image_paths: string[] | null
  image_urls: string[] | null
  file_path: string | null
  file_url: string | null
  is_embeded: boolean
  is_batch: boolean
  is_variant: boolean
  is_diff_price: boolean
  is_imei: boolean
  featured: boolean
  product_list: string | null
  variant_list: string | null
  qty_list: string | null
  price_list: string | null
  product_details: Record<string, unknown> | null
  short_description: string | null
  specification: Record<string, unknown> | null
  related_products: string | null
  is_addon: boolean
  extras: string | null
  menu_type: string | null
  variant_option: string[] | null
  variant_value: string[] | null
  is_active: boolean
  is_online: boolean
  in_stock: boolean
  track_inventory: boolean
  is_sync_disable: boolean
  woocommerce_product_id: number | null
  woocommerce_media_id: number | null
  tags: string | null
  meta_title: string | null
  meta_description: string | null
  warranty: number | null
  guarantee: number | null
  warranty_type: string | null
  guarantee_type: string | null
  wastage_percent: number | null
  production_cost: number | null
  is_recipe: boolean
  variants?: ProductVariant[] | null
  warehouse_prices?: ProductWarehousePrice[] | null
  product_warehouses?: ProductWarehouseStock[] | null
  created_at: string | null
  updated_at: string | null
}

// Form Data for Create/Update
export interface ProductFormData {
  name: string
  code: string
  type: ProductTypeEnum
  barcode_symbology: string
  brand_id?: number | null
  category_id: number
  unit_id?: number | null
  purchase_unit_id?: number | null
  sale_unit_id?: number | null
  cost?: number | null
  price: number
  wholesale_price?: number | null
  profit_margin?: number | null
  profit_margin_type?: string | null
  alert_quantity?: number | null
  daily_sale_objective?: number | null
  promotion?: boolean | null
  promotion_price?: number | null
  starting_date?: string | null
  last_date?: string | null
  tax_id?: number | null
  tax_method?: TaxMethodEnum | null
  image_paths?: File[] | null
  file_path?: File | null
  deleted_image_paths?: string[] | null
  is_embeded?: boolean | null
  is_batch?: boolean | null
  is_variant?: boolean | null
  is_diff_price?: boolean | null
  is_imei?: boolean | null
  featured?: boolean | null
  is_active?: boolean | null
  is_online?: boolean | null
  in_stock?: boolean | null
  track_inventory?: boolean | null
  is_sync_disable?: boolean | null
  is_recipe?: boolean | null
  is_addon?: boolean | null
  product_details?: Record<string, unknown> | null
  short_description?: string | null
  specification?: Record<string, unknown> | null
  related_products?: number[] | null
  extras?: string[] | null
  menu_type?: string[] | null
  kitchen_id?: number | null
  woocommerce_product_id?: number | null
  woocommerce_media_id?: number | null
  tags?: string | null
  meta_title?: string | null
  meta_description?: string | null
  warranty?: number | null
  guarantee?: number | null
  warranty_type?: string | null
  guarantee_type?: string | null
  wastage_percent?: number | null
  combo_unit_id?: number | null
  production_cost?: number | null
  variants?: ProductVariantInput[] | null
  warehouse_prices?: WarehousePriceInput[] | null
  combo_products?: ComboProductInput[] | null
  is_initial_stock?: boolean | null
  initial_stock?: InitialStockInput[] | null
}

export interface ProductVariantInput {
  name: string
  item_code?: string | null
  additional_cost?: number | null
  additional_price?: number | null
}

export interface WarehousePriceInput {
  warehouse_id: number
  price: number
}

export interface ComboProductInput {
  product_id: number
  product_name?: string
  product_code?: string
  variant_id?: number | null
  variant_name?: string | null
  qty: number
  price: number
  wastage_percent?: number | null
  combo_unit_id?: number | null
}

export interface InitialStockInput {
  warehouse_id: number
  qty: number
}

// List Params
export type ProductListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean[]
  featured?: boolean[]
  type?: string[]
  brand_id?: number[]
  category_id?: number[]
  unit_id?: number[]
  warehouse_id?: number
  stock_filter?: "all" | "with_stock" | "without_stock"
}

export interface ProductOption {
  value: number
  label: string
}

export interface UnitSaleOption {
  id: number
  name: string
  code: string
  operator?: string | null
  operation_value?: number | null
}

export interface ComboSearchItem {
  id: number
  name: string
  code: string
  price?: number | null
  unit?: Unit | null
  productVariants?: Array<{
    variant_id: number
    item_code: string
    qty?: number | null
  }>
}

export type ProductExportParams = {
  ids?: number[]
  format: "excel" | "pdf"
  method: "download" | "email"
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}
