"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useApiClient } from "@/lib/api/use-api-client"
import { ValidationError } from "@/lib/api/errors"

import type {
  Category,
  CategoryExportParams,
  CategoryFormData,
  CategoryListParams,
  CategoryOption,
} from "./types"

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  options: () => [...categoryKeys.all, "options"] as const,
}

const BASE_PATH = "/categories"

function toApiParams(
  params?: CategoryListParams
): Record<string, string | number | boolean | null | undefined> {
  if (!params) return {}
  const out: Record<string, string | number | boolean | null | undefined> = {}
  if (params.page != null) out.page = params.page
  if (params.per_page != null) out.per_page = params.per_page
  if (params.search != null && params.search !== "") out.search = params.search
  if (params.status != null) out.status = params.status
  if (params.featured != null) out.featured = params.featured
  if (params.parent_id != null) out.parent_id = params.parent_id ?? ""
  if (params.start_date != null && params.start_date !== "")
    out.start_date = params.start_date
  if (params.end_date != null && params.end_date !== "")
    out.end_date = params.end_date
  return out
}

export function useCategories(params?: CategoryListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Category[]>(BASE_PATH, {
        params: toApiParams(params),
      })
      return response
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

export function useOptionCategories() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: categoryKeys.options(),
    queryFn: async () => {
      const response = await api.get<CategoryOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useCategory(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: categoryKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<Category>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== "loading",
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useCreateCategory() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const formData = new FormData()
      formData.append("name", data.name)
      if (data.slug) formData.append("slug", data.slug)
      if (data.short_description)
        formData.append("short_description", data.short_description)
      if (data.page_title) formData.append("page_title", data.page_title ?? "")
      const imageFile = data.image?.[0]
      if (imageFile instanceof File) formData.append("image", imageFile)
      const iconFile = data.icon?.[0]
      if (iconFile instanceof File) formData.append("icon", iconFile)
      if (data.parent_id != null)
        formData.append("parent_id", String(data.parent_id))
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0")
      if (data.featured !== undefined)
        formData.append("featured", data.featured ? "1" : "0")
      if (data.is_sync_disable !== undefined)
        formData.append("is_sync_disable", data.is_sync_disable ? "1" : "0")
      if (data.woocommerce_category_id != null)
        formData.append(
          "woocommerce_category_id",
          String(data.woocommerce_category_id)
        )

      const response = await api.post<{ data: Category }>(BASE_PATH, formData)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateCategory() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: number; data: Partial<CategoryFormData> }) => {
      const formData = new FormData()
      formData.append("_method", "PUT")
      if (data.name) formData.append("name", data.name)
      if (data.slug !== undefined) formData.append("slug", data.slug ?? "")
      if (data.short_description !== undefined)
        formData.append("short_description", data.short_description ?? "")
      if (data.page_title !== undefined)
        formData.append("page_title", data.page_title ?? "")
      const imageFile = data.image?.[0]
      if (imageFile instanceof File) formData.append("image", imageFile)
      const iconFile = data.icon?.[0]
      if (iconFile instanceof File) formData.append("icon", iconFile)
      if (data.parent_id !== undefined)
        formData.append("parent_id", data.parent_id != null ? String(data.parent_id) : "")
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0")
      if (data.featured !== undefined)
        formData.append("featured", data.featured ? "1" : "0")
      if (data.is_sync_disable !== undefined)
        formData.append("is_sync_disable", data.is_sync_disable ? "1" : "0")
      if (data.woocommerce_category_id !== undefined)
        formData.append(
          "woocommerce_category_id",
          data.woocommerce_category_id != null
            ? String(data.woocommerce_category_id)
            : ""
        )

      const response = await api.post<{ data: Category }>(
        `${BASE_PATH}/${id}`,
        formData
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() })
      toast.success(data.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useReparentCategory() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      parent_id,
    }: { id: number; parent_id: number | null }) => {
      const response = await api.patch<{ data: Category }>(
        `${BASE_PATH}/${id}/reparent`,
        { parent_id }
      )
      if (!response.success) throw new Error(response.message)
      return { id, message: response.message }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() })
      toast.success(data.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteCategory() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<unknown>(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateCategories() {
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeactivateCategories() {
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkEnableFeaturedCategories() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ updated_count: number }>(
        `${BASE_PATH}/bulk-enable-featured`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDisableFeaturedCategories() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ updated_count: number }>(
        `${BASE_PATH}/bulk-disable-featured`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkEnableSyncCategories() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ updated_count: number }>(
        `${BASE_PATH}/bulk-enable-sync`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDisableSyncCategories() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await api.post<{ updated_count: number }>(
        `${BASE_PATH}/bulk-disable-sync`,
        { ids }
      )
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDestroyCategories() {
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useCategoriesImport() {
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useCategoriesExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: CategoryExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        const fileName = `categories-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`
        link.download = fileName
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

export function useCategoriesTemplateDownload() {
  const { api } = useApiClient()
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "categories-sample.csv"
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
