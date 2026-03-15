import { z } from "zod"

import { CSV_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/utils/mimes"

export const unitSchema = z.object({
  name: z
    .string()
    .min(1, "Unit name is required")
    .max(255, "Name is too long"),
  code: z
    .string()
    .min(1, "Unit code is required")
    .max(50, "Code is too long"),
  base_unit: z.number().nullable().optional(),
  operator: z.string().nullable().optional(),
  operation_value: z.number().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
})

export const unitImportSchema = z.object({
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

export const unitExportSchema = z
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

export type UnitFormData = z.infer<typeof unitSchema>
export type UnitImportFormData = z.infer<typeof unitImportSchema>
export type UnitExportFormData = z.infer<typeof unitExportSchema>

