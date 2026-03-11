export interface Meta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
  meta?: Meta
  errors?: Record<string, string[]>
}

export interface NormalizedApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
  meta?: Meta
  errors?: Record<string, string[]>
}