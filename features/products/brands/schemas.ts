import { z } from "zod"

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(255, "Name is too long"),
  slug: z.string().max(255, "Slug is too long").nullable().optional(),
  short_description: z
    .string()
    .max(1000, "Description is too long")
    .nullable()
    .optional(),
  page_title: z.string().max(255, "Page title is too long").nullable().optional(),
  image: z.array(z.instanceof(File)).max(1, "Please select only one image").optional(),
  is_active: z.boolean().nullable().optional(),
})

export type BrandFormData = z.infer<typeof brandSchema>
