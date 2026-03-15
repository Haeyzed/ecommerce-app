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
  active_status: CategoryActiveStatus
  featured: boolean
  featured_status: CategoryFeaturedStatus
  is_sync_disable: boolean
  sync_status: CategorySyncStatus
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
  status?: boolean
  featured?: boolean
  parent_id?: number | null
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

export type CategoryActiveStatus = "active" | "inactive"
export type CategoryFeaturedStatus = "yes" | "no"
export type CategorySyncStatus = "enabled" | "disabled"
