export interface Brand {
  id: number
  name: string
  slug: string | null
  short_description: string | null
  is_active: boolean
  image_path?: string | null
  image_url?: string | null
  page_title?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface BrandFormData {
  name: string
  slug?: string | null
  short_description?: string | null
  page_title?: string | null
  image_path?: File[] | null
  is_active?: boolean | null
}

export type BrandListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: (0 | 1)[]
  start_date?: string
  end_date?: string
}

export interface BrandOption {
  value: number
  label: string
}

export type BrandExportParams = {
  ids?: number[]
  format: "excel" | "pdf"
  method: "download" | "email"
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}
