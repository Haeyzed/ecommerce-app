export interface Tax {
  id: number
  name: string
  rate: number
  woocommerce_tax_id: number | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface TaxFormData {
  name: string
  rate: number
  woocommerce_tax_id?: number | null
  is_active?: boolean | null
}

export type TaxListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: (0 | 1)[]
  start_date?: string
  end_date?: string
}

export type TaxExportParams = {
  ids?: number[]
  format: "excel" | "pdf"
  method: "download" | "email"
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}

export interface TaxOption {
  value: number
  label: string
}
