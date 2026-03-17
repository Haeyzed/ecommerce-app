"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useApiClient } from "@/lib/api/use-api-client"
import { ValidationError } from "@/lib/api/errors"

import type {
  Warehouse,
  WarehouseExportParams,
  WarehouseFormData,
  WarehouseListParams,
  WarehouseOption,
} from "./types"

export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...warehouseKeys.lists(), filters] as const,
  details: () => [...warehouseKeys.all, "detail"] as const,
  detail: (id: number) => [...warehouseKeys.details(), id] as const,
  options: () => [...warehouseKeys.all, "options"] as const,
}

const BASE_PATH = "/warehouses"

function toApiParams(
  params?: WarehouseListParams
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

export function useWarehouses(params?: WarehouseListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: async () => {
      return await api.get<Warehouse[]>(BASE_PATH, {
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

export function useOptionWarehouses() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: warehouseKeys.options(),
    queryFn: async () => {
      const response = await api.get<WarehouseOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useWarehouse(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: warehouseKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<Warehouse>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== "loading",
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useCreateWarehouse() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: WarehouseFormData) => {
      const payload: Record<string, unknown> = {}

      payload.name = data.name
      payload.phone_number = data.phone_number
      payload.address = data.address
      if (data.email !== undefined) payload.email = data.email
      payload.is_active = data.is_active !== undefined ? data.is_active : true

      const response = await api.post<{ data: Warehouse }>(BASE_PATH, payload)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success(response.message || "Warehouse created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create warehouse")
    },
  })
}

export function useUpdateWarehouse() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
                         id,
                         data,
                       }: {
      id: number
      data: Partial<WarehouseFormData>
    }) => {
      const payload: Record<string, unknown> = {}

      if (data.name !== undefined) payload.name = data.name
      if (data.phone_number !== undefined) payload.phone_number = data.phone_number
      if (data.address !== undefined) payload.address = data.address
      if (data.email !== undefined) payload.email = data.email
      if (data.is_active !== undefined) payload.is_active = data.is_active

      const response = await api.put<{ data: Warehouse }>(
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(data.id) })
      toast.success(data.message || "Warehouse updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update warehouse")
    },
  })
}

export function useDeleteWarehouse() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<unknown>(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success(response.message || "Warehouse deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete warehouse")
    },
  })
}

export function useBulkDeleteWarehouses() {
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateWarehouses() {
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeactivateWarehouses() {
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useWarehousesImport() {
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
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() })
      toast.success(response.message || "Import successful")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to import")
    },
  })
}

export function useWarehousesExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: WarehouseExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `warehouses-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`
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

export function useWarehousesTemplateDownload() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "warehouses-sample.csv"
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