"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useApiClient } from "@/lib/api/use-api-client"
import { ValidationError } from "@/lib/api/errors"

import type {
  BrandApi,
  BrandFormData,
  BrandListParams,
  BrandOption,
} from "./types"

export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...brandKeys.lists(), filters] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
  options: () => [...brandKeys.all, "options"] as const,
}

const BASE_PATH = "/brands"

export function useBrands(params?: BrandListParams) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: brandKeys.list(params),
    queryFn: async () => {
      const response = await api.get<BrandApi[]>(BASE_PATH, {
        params: params as Record<string, string | number | boolean | null | undefined>,
      })
      return response
    },
    enabled: sessionStatus !== "loading",
  })
  return {
    ...query,
    data: query.data?.data ?? null,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useOptionBrands() {
  const { api, sessionStatus } = useApiClient()
  return useQuery({
    queryKey: brandKeys.options(),
    queryFn: async () => {
      const response = await api.get<BrandOption[]>(`${BASE_PATH}/options`)
      return response.data ?? []
    },
    enabled: sessionStatus !== "loading",
  })
}

export function useBrand(id: number | null) {
  const { api, sessionStatus } = useApiClient()
  const query = useQuery({
    queryKey: brandKeys.detail(id ?? 0),
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<BrandApi>(`${BASE_PATH}/${id}`)
      return response.data ?? null
    },
    enabled: !!id && sessionStatus !== "loading",
  })
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  }
}

export function useCreateBrand() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BrandFormData) => {
      const formData = new FormData()
      formData.append("name", data.name)
      if (data.slug) formData.append("slug", data.slug)
      if (data.short_description)
        formData.append("short_description", data.short_description)
      if (data.page_title) formData.append("page_title", data.page_title ?? "")
      if (data.image?.length) formData.append("image", data.image[0])
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0")

      const response = await api.post<{ data: BrandApi }>(BASE_PATH, formData)
      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateBrand() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: number; data: Partial<BrandFormData> }) => {
      const formData = new FormData()
      formData.append("_method", "PUT")
      if (data.name) formData.append("name", data.name)
      if (data.slug !== undefined) formData.append("slug", data.slug ?? "")
      if (data.short_description !== undefined)
        formData.append("short_description", data.short_description ?? "")
      if (data.page_title !== undefined)
        formData.append("page_title", data.page_title ?? "")
      if (data.image?.length) formData.append("image", data.image[0])
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0")

      const response = await api.post<{ data: BrandApi }>(
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
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(data.id) })
      toast.success(data.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteBrand() {
  const { api } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<unknown>(`${BASE_PATH}/${id}`)
      if (!response.success) throw new Error(response.message)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
