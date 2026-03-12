export interface Brand {
  id: string
  name: string
  slug: string | null
  short_description: string | null
  is_active: boolean
  created_at?: string | null
}

/** API response shape (id as number from backend) */
export interface BrandApi {
  id: number
  name: string
  slug: string | null
  short_description: string | null
  is_active: boolean
  image?: string | null
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
  image?: File[] | null
  is_active?: boolean | null
}

export type BrandListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
  start_date?: string
  end_date?: string
}

export interface BrandOption {
  value: number
  label: string
}
