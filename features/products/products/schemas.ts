import { z } from "zod"
import { ProductTypeEnum, TaxMethodEnum } from "./types"

const MAX_IMAGE_SIZE = 5120 * 1024 // 5MB
const MAX_FILE_SIZE = 10240 * 1024 // 10MB
const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"]

export const productSchema = z.object({
  // Basic Info
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Name must be less than 255 characters"),
  code: z
    .string()
    .min(1, "Product code is required")
    .max(255, "Code must be less than 255 characters"),
  type: z.nativeEnum(ProductTypeEnum),
  barcode_symbology: z
    .string()
    .min(1, "Barcode symbology is required"),

  // Relationships
  brand_id: z.number().nullable().optional(),
  category_id: z.number().min(1, "Category is required"),
  unit_id: z.number().nullable().optional(),
  purchase_unit_id: z.number().nullable().optional(),
  sale_unit_id: z.number().nullable().optional(),

  // Pricing
  cost: z
    .number()
    .min(0, "Cost must be greater than or equal to 0")
    .nullable()
    .optional(),
  price: z
    .number()
    .min(0, "Price must be greater than or equal to 0"),
  wholesale_price: z
    .number()
    .min(0, "Wholesale price must be greater than or equal to 0")
    .nullable()
    .optional(),
  profit_margin: z.number().nullable().optional(),
  profit_margin_type: z
    .enum(["percentage", "fixed"])
    .nullable()
    .optional(),

  // Inventory
  alert_quantity: z.number().nullable().optional(),
  daily_sale_objective: z.number().nullable().optional(),

  // Promotion
  promotion: z.boolean().nullable().optional(),
  promotion_price: z
    .number()
    .min(0)
    .nullable()
    .optional(),
  starting_date: z.string().date().nullable().optional(),
  last_date: z.string().date().nullable().optional(),

  // Tax
  tax_id: z.number().nullable().optional(),
  tax_method: z.nativeEnum(TaxMethodEnum).nullable().optional(),

  // Images & Files
  image_paths: z
    .array(z.instanceof(File))
    .max(10, "Maximum 10 images allowed")
    .optional(),
  file_path: z.instanceof(File).nullable().optional(),

  // Flags
  is_embeded: z.boolean().nullable().optional(),
  is_batch: z.boolean().nullable().optional(),
  is_variant: z.boolean().nullable().optional(),
  is_diff_price: z.boolean().nullable().optional(),
  is_imei: z.boolean().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  is_online: z.boolean().nullable().optional(),
  in_stock: z.boolean().nullable().optional(),
  track_inventory: z.boolean().nullable().optional(),
  is_sync_disable: z.boolean().nullable().optional(),
  is_recipe: z.boolean().nullable().optional(),
  is_addon: z.boolean().nullable().optional(),

  // Details
  product_details: z.record(z.unknown()).nullable().optional(),
  short_description: z.string().nullable().optional(),
  specification: z.record(z.unknown()).nullable().optional(),

  // Related Data
  related_products: z.array(z.number()).nullable().optional(),
  extras: z.array(z.string()).nullable().optional(),
  menu_type: z.array(z.string()).nullable().optional(),
  kitchen_id: z.number().nullable().optional(),

  // WooCommerce
  woocommerce_product_id: z.number().nullable().optional(),
  woocommerce_media_id: z.number().nullable().optional(),

  // SEO
  tags: z.string().nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),

  // Warranty & Guarantee
  warranty: z.number().nullable().optional(),
  guarantee: z.number().nullable().optional(),
  warranty_type: z.string().nullable().optional(),
  guarantee_type: z.string().nullable().optional(),

  // Combo & Production
  wastage_percent: z.number().nullable().optional(),
  combo_unit_id: z.number().nullable().optional(),
  production_cost: z.number().nullable().optional(),

  // Structured Arrays
  variants: z
    .array(
      z.object({
        name: z.string(),
        item_code: z.string().nullable().optional(),
        additional_cost: z.number().nullable().optional(),
        additional_price: z.number().nullable().optional(),
      })
    )
    .nullable()
    .optional(),

  warehouse_prices: z
    .array(
      z.object({
        warehouse_id: z.number(),
        price: z.number(),
      })
    )
    .nullable()
    .optional(),

  combo_products: z
    .array(
      z.object({
        product_id: z.number(),
        variant_id: z.number().nullable().optional(),
        qty: z.number(),
        price: z.number(),
        wastage_percent: z.number().nullable().optional(),
        combo_unit_id: z.number().nullable().optional(),
      })
    )
    .nullable()
    .optional(),

  is_initial_stock: z.boolean().nullable().optional(),
  initial_stock: z
    .array(
      z.object({
        warehouse_id: z.number(),
        qty: z.number(),
      })
    )
    .nullable()
    .optional(),
})

export const productUpdateSchema = productSchema.partial().refine(
  (data) => {
    if (data.starting_date && data.last_date) {
      return new Date(data.starting_date) <= new Date(data.last_date)
    }
    return true
  },
  { message: "Start date must be before or equal to end date" }
)

export const productFilterSchema = z.object({
  search: z.string().optional(),
  is_active: z.array(z.boolean()).optional(),
  featured: z.array(z.boolean()).optional(),
  type: z
    .array(z.enum(["standard", "combo", "digital", "service"]))
    .optional(),
  brand_id: z.array(z.number()).optional(),
  category_id: z.array(z.number()).optional(),
  unit_id: z.array(z.number()).optional(),
  warehouse_id: z.number().optional(),
  stock_filter: z
    .enum(["all", "with_stock", "without_stock"])
    .optional(),
  per_page: z.number().min(1).optional(),
})

export const productImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine(
      (files) => (files?.[0]?.size ?? 0) <= 5120 * 1024,
      "File size must be less than 5MB"
    )
    .refine((files) => {
      const file = files?.[0]
      if (!file) return false
      const isValidMime = file.type === "text/csv"
      const isValidExtension = file.name.toLowerCase().endsWith(".csv")
      return isValidMime || isValidExtension
    }, "Only .csv files are allowed"),
})

export const productExportSchema = z
  .object({
    format: z.enum(["excel", "pdf"]),
    method: z.enum(["download", "email"]),
    columns: z.array(z.string()).min(1, "Please select at least one column"),
    user_id: z.number().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.method === "email") return data.user_id !== undefined
      return true
    },
    { message: "Please select a user to send the email to", path: ["user_id"] }
  )

export type ProductFormData = z.infer<typeof productSchema>
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>
export type ProductFilterData = z.infer<typeof productFilterSchema>
export type ProductImportFormData = z.infer<typeof productImportSchema>
export type ProductExportFormData = z.infer<typeof productExportSchema>
