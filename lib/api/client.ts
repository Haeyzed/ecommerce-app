import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from "./errors"
import type { ApiResponse, NormalizedApiResponse } from "./types"
import { AUTH_REDIRECT_MESSAGE_KEY } from "@/features/auth"

export interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean
  baseURL?: string
}

export interface ApiRequestOptions extends ApiClientOptions {
  params?: Record<string, string | number | boolean | null | undefined>
}

class ApiClient {
  private readonly baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || ""
  }

  async get<T>(
    url: string,
    options?: ApiRequestOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, { ...options, method: "GET" })
  }

  async post<T>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
    })
  }

  async put<T>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
    })
  }

  async patch<T>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
    })
  }

  async delete<T>(
    url: string,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, { ...options, method: "DELETE" })
  }

  async postBlob(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<Blob> {
    const fullURL = this.buildURL(url)
    const isFormData = body instanceof FormData

    const requestHeaders: Record<string, string> = {
      Accept: "*/*",
      ...(options?.headers as Record<string, string>),
    }

    if (!isFormData && body) {
      requestHeaders["Content-Type"] = "application/json"
    }

    let authToken: string | null = null
    if (!options?.skipAuth) {
      authToken = await this.getAuthToken()
    }
    if (authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`
    }

    const response = await fetch(fullURL, {
      ...options,
      method: "POST",
      headers: requestHeaders,
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return response.blob()
  }

  async getBlob(url: string, options?: ApiRequestOptions): Promise<Blob> {
    const {
      skipAuth = false,
      params,
      headers = {},
      ...fetchOptions
    } = options || {}
    const fullURL = this.buildURL(url, params)

    const requestHeaders: Record<string, string> = {
      Accept: "*/*",
      ...(headers as Record<string, string>),
    }

    let authToken: string | null = null
    if (!skipAuth) {
      authToken = await this.getAuthToken()
    }

    if (authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`
    }

    const response = await fetch(fullURL, {
      ...fetchOptions,
      method: "GET",
      headers: requestHeaders,
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return response.blob()
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === "undefined") {
      try {
        const { auth } = await import("@/auth")
        const session = await auth()
        return (session?.user as { token?: string })?.token || null
      } catch {
        return null
      }
    }
    return null
  }

  private buildURL(
    url: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    const base = url.startsWith("http")
      ? url
      : `${this.baseURL}${url.startsWith("/") ? url : `/${url}`}`

    if (!params || Object.keys(params).length === 0) {
      return base
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    const separator = base.includes("?") ? "&" : "?"
    return `${base}${separator}${searchParams.toString()}`
  }

  private normalizeResponse<T>(
    response: ApiResponse<T>
  ): NormalizedApiResponse<T> {
    return {
      success: response.success,
      message: response.message,
      data: response.data,
      meta: response.meta,
      errors: response.errors,
    }
  }

  private async handleError(response: Response): Promise<never> {
    let errorData: ApiResponse | null = null

    try {
      errorData = await response.json()
    } catch {}

    const message =
      errorData?.message || response.statusText || "An error occurred"
    const errors = errorData?.errors

    switch (response.status) {
      case 401:
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(AUTH_REDIRECT_MESSAGE_KEY, message)
          } catch {}
          try {
            const { signOut } = await import("next-auth/react")
            signOut({ redirect: true, callbackUrl: "/login" })
          } catch {}
        }
        throw new UnauthorizedError(message)

      case 403:
        throw new ForbiddenError(message)

      case 404:
        throw new NotFoundError(message)

      case 409:
        throw new ConflictError(message)

      case 422:
        throw new ValidationError(message, errors || {})

      case 500:
      default:
        throw new ServerError(message)
    }
  }

  private async request<T>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<NormalizedApiResponse<T>> {
    const {
      skipAuth = false,
      baseURL,
      params,
      headers = {},
      ...fetchOptions
    } = options
    const fullURL = this.buildURL(url, params)

    let authToken: string | null = null
    if (!skipAuth) {
      authToken = await this.getAuthToken()
    }

    const isFormData = fetchOptions.body instanceof FormData
    const requestHeaders: Record<string, string> = {
      Accept: "application/json",
      ...(headers as Record<string, string>),
    }

    if (!isFormData) {
      requestHeaders["Content-Type"] = "application/json"
    }

    if (authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`
    }

    const response = await fetch(fullURL, {
      ...fetchOptions,
      headers: requestHeaders,
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    const data: ApiResponse<T> = await response.json()
    return this.normalizeResponse(data)
  }
}

export const api = new ApiClient()
export { ApiClient }
