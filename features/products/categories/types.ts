export interface Category {
  id: number
  name: string
  slug: string | null
  short_description: string | null
  page_title: string | null
  image_path?: string | null
  image_url?: string | null
  icon?: string | null
  icon_url?: string | null
  parent_id: number | null
  is_active: boolean
  featured: boolean
  is_sync_disable: boolean
  woocommerce_category_id?: number | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  parent?: Pick<Category, "id" | "name"> | null
  children?: CategoryTreeItem[]
}

export interface CategoryTreeItem {
  id: string
  name: string
  icon_url?: string | null
  children?: CategoryTreeItem[]
}

export interface CategoryFormData {
  name: string
  slug?: string | null
  short_description?: string | null
  page_title?: string | null
  image?: File[] | null
  icon?: File[] | null
  parent_id?: number | null
  is_active?: boolean | null
  featured?: boolean | null
  is_sync_disable?: boolean | null
  woocommerce_category_id?: number | null
}

export type CategoryListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: (0 | 1)[]
  featured?: (0 | 1)[]
  is_sync_disable?: (0 | 1)[]
  parent_id?: number | null | ""
  start_date?: string
  end_date?: string
}

export type CategoryExportParams = {
  ids?: number[]
  format: "excel" | "pdf"
  method: "download" | "email"
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}

export interface CategoryOption {
  value: number
  label: string
}
