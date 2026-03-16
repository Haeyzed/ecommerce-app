"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useApiClient } from "@/lib/api/use-api-client"
import { ValidationError } from "@/lib/api/errors"

import type {
  Product,
  ProductExportParams,
  ProductFormData,
  ProductListParams,
  ProductOption,
} from "./types"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  options: () => [...productKeys.all, "options"] as const,
}

const BASE_PATH = "/products"

function toApiParams(
  params?: ProductListParams
): Record<string, string | number | boolean | null | undefined> {
  if (!params) return {}
  const out: Record<string, string | number | boolean | null | undefined> = {}
  if (params.page != null) out.page = params.page
  if (params.per_page != null) out.per_page = params.per_page
  if (params.search != null && params.search !== "") out.search = params.search
  if (params.is_active != null && params.is_active.length > 0) {
    out.is_active = params.is_active.join(",")
  }
  if (params.start_date != null && params.start_date !== "")
    out.start_date = params.start_date
  if (params.end_date != null && params.end_date !== "")
    out.end_date = params.end_date
  return out
}

export function useProducts(params?: ProductListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Product[]>(BASE_PATH, {
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

export function useOptionProducts() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: productKeys.options(),
    queryFn: async () => {
      const response = await api.get<ProductOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useProduct(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<Product>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== "loading",
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useCreateProduct() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData()
      formData.append("name", data.name)
      if (data.slug) formData.append("slug", data.slug)
      if (data.short_description)
        formData.append("short_description", data.short_description)
      if (data.page_title) formData.append("page_title", data.page_title ?? "")
      const imageFile = data.image_path?.[0]
      if (imageFile instanceof File) {
        formData.append("image_path", imageFile)
      }
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0")

      const response = await api.post<{ data: Product }>(BASE_PATH, formData)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateProduct() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<ProductFormData>
    }) => {
      const formData = new FormData()
      formData.append("_method", "PUT")
      if (data.name) formData.append("name", data.name)
      if (data.slug !== undefined) formData.append("slug", data.slug ?? "")
      if (data.short_description !== undefined)
        formData.append("short_description", data.short_description ?? "")
      if (data.page_title !== undefined)
        formData.append("page_title", data.page_title ?? "")
      const imageFile = data.image_path?.[0]
      if (imageFile instanceof File) {
        formData.append("image_path", imageFile)
      }
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0")

      const response = await api.post<{ data: Product }>(
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) })
      toast.success(data.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteProduct() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<unknown>(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkActivateProducts() {
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeactivateProducts() {
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useBulkDeleteProducts() {
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useProductsImport() {
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useProductsExport() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (params: ProductExportParams) => {
      if (params.method === "download") {
        const blob = await api.postBlob(`${BASE_PATH}/export`, params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        const fileName = `products-export-${Date.now()}.${params.format === "pdf" ? "pdf" : "xlsx"}`
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

export function useProductsTemplateDownload() {
  const { api } = useApiClient()
  return useMutation({
    mutationFn: async () => {
      const blob = await api.getBlob(`${BASE_PATH}/download`)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "products-sample.csv"
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
