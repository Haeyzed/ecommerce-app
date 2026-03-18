"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useApiClient } from "@/lib/api/use-api-client"
import { ValidationError } from "@/lib/api/errors"

import type {
  Tax,
  TaxExportParams,
  TaxFormData,
  TaxListParams,
  TaxOption,
} from "./types"

export const taxKeys = {
  all: ["taxes"] as const,
  lists: () => [...taxKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...taxKeys.lists(), filters] as const,
  details: () => [...taxKeys.all, "detail"] as const,
  detail: (id: number) => [...taxKeys.details(), id] as const,
  options: () => [...taxKeys.all, "options"] as const,
}

const BASE_PATH = "/taxes"

function toApiParams(
  params?: TaxListParams
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

export function useTaxes(params?: TaxListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: taxKeys.list(params),
    queryFn: async () => {
      return await api.get<Tax[]>(BASE_PATH, {
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

export function useOptionTaxes() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: taxKeys.options(),
    queryFn: async () => {
      const response = await api.get<TaxOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useTax(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: taxKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<Tax>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== "loading",
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useCreateTax() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TaxFormData) => {
      const payload: Record<string, unknown> = {}

      payload.name = data.name
      payload.rate = data.rate
      if (data.woocommerce_tax_id !== undefined)
        payload.woocommerce_tax_id = data.woocommerce_tax_id
      payload.is_active = data.is_active !== undefined ? data.is_active : true

      const response = await api.post<{ data: Tax }>(BASE_PATH, payload)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() })
      toast.success(response.message || "Tax created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create tax")
    },
  })
}

export function useUpdateTax() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<TaxFormData>
    }) => {
      const payload: Record<string, unknown> = {}

      if (data.name !== undefined) payload.name = data.name
      if (data.rate !== undefined) payload.rate = data.rate
      if (data.woocommerce_tax_id !== undefined)
        payload.woocommerce_tax_id = data.woocommerce_tax_id
      if (data.is_active !== undefined) payload.is_active = data.is_active

      const response = await api.put<{ data: Tax }>(
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
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taxKeys.detail(data.id) })
      toast.success(data.message || "Tax updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tax")
    },
  })
}

export function useDeleteTax() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<unknown>(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() })
      toast.success(response.message || "Tax deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete tax")
    },
  })
}

export function useBulkDeleteTaxes() {
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
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateTaxes() {
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
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeactivateTaxes() {
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
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useTaxesImport() {
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
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() })
      toast.success(response.message || "Import successful")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to import")
    },
  })
}

export function useTaxesExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: TaxExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `taxes-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`
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

export function useTaxesTemplateDownload() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "taxes-sample.csv"
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
