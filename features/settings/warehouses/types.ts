export interface Warehouse {
  id: number
  name: string
  phone_number: string
  email: string | null
  address: string
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface WarehouseFormData {
  name: string
  phone_number: string
  email?: string | null
  address: string
  is_active?: boolean | null
}

export type WarehouseListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: (0 | 1)[]
  start_date?: string
  end_date?: string
}

export type WarehouseExportParams = {
  ids?: number[]
  format: "excel" | "pdf"
  method: "download" | "email"
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}

export interface WarehouseOption {
  value: number
  label: string
}
