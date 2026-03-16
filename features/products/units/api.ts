"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useApiClient } from "@/lib/api/use-api-client"
import { ValidationError } from "@/lib/api/errors"

import type {
  Unit,
  UnitExportParams,
  UnitFormData,
  UnitListParams,
  UnitOption,
} from "./types"

export const unitKeys = {
  all: ["units"] as const,
  lists: () => [...unitKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...unitKeys.lists(), filters] as const,
  details: () => [...unitKeys.all, "detail"] as const,
  detail: (id: number) => [...unitKeys.details(), id] as const,
  options: () => [...unitKeys.all, "options"] as const,
  baseUnits: () => [...unitKeys.all, "base-units"] as const,
}

const BASE_PATH = "/units"

function toApiParams(
  params?: UnitListParams
): Record<string, string | number | boolean | null | undefined> {
  if (!params) return {}
  const out: Record<string, string | number | boolean | null | undefined> = {}
  if (params.page != null) out.page = params.page
  if (params.per_page != null) out.per_page = params.per_page
  if (params.search != null && params.search !== "") out.search = params.search

  if (params.is_active != null && params.is_active.length > 0) {
    out.is_active = params.is_active.map((v) => (v ? 1 : 0)).join(",")
  }

  if (params.start_date != null && params.start_date !== "") {
    out.start_date = params.start_date
  }
  if (params.end_date != null && params.end_date !== "") {
    out.end_date = params.end_date
  }

  return out
}

export function useUnits(params?: UnitListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: unitKeys.list(params),
    queryFn: async () => {
      return await api.get<Unit[]>(BASE_PATH, {
        params: toApiParams(params),
      })
    },
    enabled: sessionStatus !== "loading",
  })
  return {
    ...query,
    data: query.data?.data ?? null,
    meta: query.data?.meta,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useOptionUnits() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: unitKeys.options(),
    queryFn: async () => {
      const response = await api.get<UnitOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useBaseUnits() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: unitKeys.baseUnits(),
    queryFn: async () => {
      const response = await api.get<UnitOption[]>(`${BASE_PATH}/base-units`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useUnit(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: unitKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<Unit>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== "loading",
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useCreateUnit() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UnitFormData) => {
      const payload: Record<string, unknown> = {}

      // Basic Info
      payload.name = data.name
      payload.code = data.code

      // Configuration
      if (data.base_unit !== undefined && data.base_unit !== null)
        payload.base_unit = data.base_unit
      if (data.operator !== undefined && data.operator !== null)
        payload.operator = data.operator
      if (data.operation_value !== undefined && data.operation_value !== null)
        payload.operation_value = data.operation_value

      // Flags
      payload.is_active = data.is_active !== undefined ? data.is_active : true

      const response = await api.post<{ data: Unit }>(BASE_PATH, payload)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() })
      toast.success(response.message || "Unit created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create unit")
    },
  })
}

export function useUpdateUnit() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
                         id,
                         data,
                       }: {
      id: number
      data: Partial<UnitFormData>
    }) => {
      const payload: Record<string, unknown> = {}

      // Basic Info
      if (data.name !== undefined) payload.name = data.name
      if (data.code !== undefined) payload.code = data.code

      // Configuration
      if (data.base_unit !== undefined) payload.base_unit = data.base_unit
      if (data.operator !== undefined) payload.operator = data.operator
      if (data.operation_value !== undefined)
        payload.operation_value = data.operation_value

      // Flags
      if (data.is_active !== undefined) payload.is_active = data.is_active

      const response = await api.put<{ data: Unit }>(
        `${BASE_PATH}/${id}`,
        payload
      )
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return { id, message: response.message }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() })
      queryClient.invalidateQueries({ queryKey: unitKeys.detail(data.id) })
      toast.success(data.message || "Unit updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update unit")
    },
  })
}

export function useDeleteUnit() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<unknown>(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() })
      toast.success(response.message || "Unit deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete unit")
    },
  })
}

export function useBulkDeleteUnits() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ deleted_count: number }>(
        `${BASE_PATH}/bulk-destroy`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateUnits() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ activated_count: number }>(
        `${BASE_PATH}/bulk-activate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeactivateUnits() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ deactivated_count: number }>(
        `${BASE_PATH}/bulk-deactivate`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUnitsImport() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append("file", file)
      const response = await api.post<unknown>(`${BASE_PATH}/import`, form)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() })
      toast.success(response.message || "Import successful")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to import")
    },
  })
}

export function useUnitsExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: UnitExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `units-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        return { message: "Export downloaded successfully" }
      }
      const response = await api.post<unknown>(`${BASE_PATH}/export`, params)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUnitsTemplateDownload() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "units-sample.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      return { message: "Sample template downloaded" }
    },
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}