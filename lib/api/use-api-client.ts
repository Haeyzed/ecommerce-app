import { useSession } from "next-auth/react"
import type { ApiClientOptions, ApiRequestOptions } from "./client"
import { api } from "./client"
import type { NormalizedApiResponse } from "./types"

export interface UseApiClientReturn {
  api: {
    get: <T>(
      url: string,
      options?: ApiRequestOptions
    ) => Promise<NormalizedApiResponse<T>>
    post: <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>
    put: <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>
    patch: <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>
    delete: <T>(
      url: string,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>
    postBlob: (
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ) => Promise<Blob>
    getBlob: (url: string, options?: ApiRequestOptions) => Promise<Blob>
  }
  sessionStatus: "loading" | "authenticated" | "unauthenticated"
}

export function useApiClient(): UseApiClientReturn {
  const { data: session, status } = useSession()

  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {}
    if (session?.user?.token) {
      headers.Authorization = `Bearer ${session.user.token}`
    }
    return headers
  }

  const apiMethods = {
    get: async <T>(
      url: string,
      options?: ApiRequestOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.get<T>(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      })
    },

    post: async <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      const headers =
        body instanceof FormData
          ? getHeaders()
          : { ...getHeaders(), ...options?.headers }
      return api.post<T>(url, body, {
        ...options,
        headers,
        skipAuth: true,
      })
    },

    put: async <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.put<T>(url, body, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      })
    },

    patch: async <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.patch<T>(url, body, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      })
    },

    delete: async <T>(
      url: string,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.delete<T>(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      })
    },

    postBlob: async (
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ): Promise<Blob> => {
      const headers =
        body instanceof FormData
          ? getHeaders()
          : { ...getHeaders(), ...options?.headers }
      return api.postBlob(url, body, {
        ...options,
        headers,
        skipAuth: true,
      })
    },

    getBlob: async (
      url: string,
      options?: ApiRequestOptions
    ): Promise<Blob> => {
      return api.getBlob(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      })
    },
  }

  return { api: apiMethods, sessionStatus: status }
}
