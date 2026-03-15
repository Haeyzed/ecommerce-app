export interface Unit {
  id: number
  code: string
  name: string
  base_unit: number | null
  base_unit_relation?: {
    id: number
    code: string
    name: string
  } | null
  operator: string | null
  operation_value: number | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface UnitFormData {
  code: string
  name: string
  base_unit?: number | null
  operator?: string | null
  operation_value?: number | null
  is_active?: boolean | null
}

export type UnitListParams = {
  page?: number
  per_page?: number
  search?: string
  is_active?: (0 | 1)[]
  start_date?: string
  end_date?: string
}

export type UnitExportParams = {
  ids?: number[]
  format: "excel" | "pdf"
  method: "download" | "email"
  columns: string[]
  user_id?: number
  start_date?: string
  end_date?: string
}

export interface UnitOption {
  value: number
  label: string
}

