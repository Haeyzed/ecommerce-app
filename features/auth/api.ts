"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { UnauthorizedError, useApiClient, ValidationError } from "@/lib/api"

import type {
  AuthResponse,
  ForgotPasswordRequest,
  LockScreenRequest,
  LoginRequest,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "./types"

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
}

const BASE_PATH = "/auth"

export function useAuthSession() {
  return useSession()
}

export function useAuth() {
  const { api, sessionStatus } = useApiClient()

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await api.get<User>(`${BASE_PATH}/user`)

      if (!response.success || !response.data) {
        throw new Error(response.message)
      }

      return response.data
    },
    enabled: sessionStatus === "authenticated",
    retry: (failureCount, error: unknown) => {
      const err = error as { status?: number } | null
      if (err?.status === 401) return false
      return failureCount < 2
    },
  })
}

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { api } = useApiClient()

  const raw = searchParams.get("callbackUrl") ?? "/dashboard"
  const callbackUrl = raw.startsWith("/") ? raw : "/dashboard"

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post<AuthResponse>(
        `${BASE_PATH}/login`,
        credentials,
        { skipAuth: true }
      )

      if (!response.success || !response.data) {
        throw new Error(response.message)
      }

      const result = await signIn("credentials", {
        identifier: credentials.identifier,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      router.push(callbackUrl)
      router.refresh()
      toast.success(message)
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        throw error
      }
      toast.error(error.message)
    },
  })
}

function toRegisterBody(data: RegisterRequest): FormData | RegisterRequest {
  const hasImage =
    Array.isArray(data.image) &&
    data.image.length > 0 &&
    data.image[0] instanceof File
  if (!hasImage) {
    const { image: _i, ...rest } = data
    return rest as RegisterRequest
  }
  const form = new FormData()
  form.append("name", data.name)
  if (data.username?.trim()) form.append("username", data.username.trim())
  if (data.email?.trim()) form.append("email", data.email.trim())
  if (data.phone?.trim()) form.append("phone", data.phone.trim())
  if (data.company_name?.trim())
    form.append("company_name", data.company_name.trim())
  form.append("password", data.password)
  form.append("password_confirmation", data.password_confirmation)
  if (data.image?.[0]) form.append("image", data.image[0])
  return form
}

export function useRegister() {
  const router = useRouter()
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const body = toRegisterBody(data)
      const response = await api.post<AuthResponse>(
        `${BASE_PATH}/register`,
        body,
        { skipAuth: true }
      )

      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }

      const identifier =
        data.email?.trim() || data.username?.trim() || data.name
      const result = await signIn("credentials", {
        identifier,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      router.push("/dashboard")
      router.refresh()
      toast.success(message)
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        throw error
      }
      toast.error(error.message)
    },
  })
}

export function useUnlock() {
  const router = useRouter()
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (credentials: LockScreenRequest) => {
      const response = await api.post<null>(
        `${BASE_PATH}/unlock`,
        { password: credentials.password },
        { skipAuth: false }
      )

      if (!response.success) {
        throw new Error(response.message)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      router.refresh()
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.message)
      if (error instanceof UnauthorizedError) {
        router.push("/login")
        router.refresh()
      }
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<null>(
        `${BASE_PATH}/logout`,
        {},
        { skipAuth: false }
      )

      if (!response.success) {
        throw new Error(response.message)
      }
      await signOut({ redirect: false })

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      queryClient.clear()
      router.push("/login")
      router.refresh()
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useForgotPassword() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await api.post(`${BASE_PATH}/forgot-password`, data, {
        skipAuth: true,
      })

      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      toast.success(message)
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        throw error
      }
      toast.error(error.message)
    },
  })
}

export function useResetPassword() {
  const router = useRouter()
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await api.post(`${BASE_PATH}/reset-password`, data, {
        skipAuth: true,
      })

      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors)
        }
        throw new Error(response.message)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      router.push("/login")
      toast.success(message)
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        throw error
      }
      toast.error(error.message)
    },
  })
}

export function useVerifyEmail() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post(
        `${BASE_PATH}/verify-email`,
        { token },
        { skipAuth: true }
      )

      if (!response.success) {
        throw new Error(response.message)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useResendVerification() {
  const { api } = useApiClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `${BASE_PATH}/resend-verification`,
        {},
        { skipAuth: false }
      )

      if (!response.success) {
        throw new Error(response.message)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: ({ message }) => {
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useRefreshToken() {
  const { api } = useApiClient()
  const { update: updateSession } = useSession()

  return useMutation<
    { data: RefreshTokenResponse; message: string },
    Error,
    boolean
  >({
    mutationFn: async (revokeOldToken = false) => {
      const response = await api.post<RefreshTokenResponse>(
        `${BASE_PATH}/refresh-token`,
        { revoke_old_token: revokeOldToken },
        { skipAuth: false }
      )

      if (!response.success || !response.data) {
        throw new Error(response.message)
      }

      return { data: response.data, message: response.message }
    },
    onSuccess: async ({ data, message }) => {
      await updateSession({ user: { token: data.token } })
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
