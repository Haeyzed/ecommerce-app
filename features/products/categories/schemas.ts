import { z } from "zod"
import { CSV_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/utils/mimes"

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Name is too long"),
  slug: z.string().max(255, "Slug is too long").nullable().optional(),
  short_description: z
    .string()
    .max(1000, "Description is too long")
    .nullable()
    .optional(),
  page_title: z
    .string()
    .max(255, "Page title is too long")
    .nullable()
    .optional(),
  image: z
    .array(z.instanceof(File))
    .max(1, "Please select only one image")
    .optional(),
  icon: z
    .array(z.instanceof(File))
    .max(1, "Please select only one icon")
    .optional(),
  parent_id: z.number().int().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  is_sync_disable: z.boolean().nullable().optional(),
  woocommerce_category_id: z.number().int().nullable().optional(),
})

export const categoryImportSchema = z.object({
  file: z
    .array(z.custom<File>())
    .min(1, "Please select a file to import")
    .max(1, "Please select only one file")
    .refine(
      (files) => (files?.[0]?.size ?? 0) <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine((files) => {
      const file = files?.[0]
      if (!file) return false
      const isValidMime = CSV_MIME_TYPES.includes(file.type)
      const isValidExtension = file.name.toLowerCase().endsWith(".csv")
      return isValidMime || isValidExtension
    }, "Only .csv files are allowed"),
})

export const categoryExportSchema = z
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

export type CategoryFormData = z.infer<typeof categorySchema>
export type CategoryImportFormData = z.infer<typeof categoryImportSchema>
export type CategoryExportFormData = z.infer<typeof categoryExportSchema>
