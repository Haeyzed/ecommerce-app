import { z } from "zod"

import { CSV_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/utils/mimes"

export const taxSchema = z.object({
  name: z
    .string()
    .min(1, "Tax name is required")
    .max(255, "Name is too long"),
  rate: z
    .number()
    .min(0, "Rate must be at least 0")
    .max(100, "Rate must be at most 100"),
  woocommerce_tax_id: z.number().int().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
})

export const taxImportSchema = z.object({
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

export const taxExportSchema = z
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

export type TaxFormData = z.infer<typeof taxSchema>
export type TaxImportFormData = z.infer<typeof taxImportSchema>
export type TaxExportFormData = z.infer<typeof taxExportSchema>
