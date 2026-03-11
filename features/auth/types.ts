export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  user_permissions: string[]
}

export interface AuthResponse {
  user: User
  token: string
}

export interface RefreshTokenResponse {
  user: User
  token: string
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export interface LockScreenRequest {
  password: string
}