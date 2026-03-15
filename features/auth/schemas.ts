import { z } from "zod"

import { MAX_FILE_SIZE } from "@/lib/utils/mimes"

const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, "Image must be 5MB or less")
  .refine(
    (f) =>
      [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ].includes(f.type),
    "Only JPEG, PNG, JPG, GIF, or WebP are allowed"
  )

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name is too long"),
    username: z
      .union([
        z
          .string()
          .max(255)
          .regex(
            /^[a-zA-Z0-9_-]*$/,
            "Only letters, numbers, underscores and hyphens"
          ),
        z.literal(""),
      ])
      .optional(),
    email: z
      .union([
        z.string().email("Invalid email address").max(255, "Email is too long"),
        z.literal(""),
      ])
      .optional(),
    image: z
      .array(imageFileSchema)
      .max(1, "Please select only one image")
      .optional(),
    phone: z
      .string()
      .max(255, "Phone number is too long")
      .optional()
      .or(z.literal("")),
    company_name: z
      .string()
      .max(255, "Company name is too long")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })
  .refine(
    (data) => (data.email ?? "").length > 0 || (data.username ?? "").length > 0,
    {
      message: "Provide either email or username",
      path: ["email"],
    }
  )

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

export const lockScreenSchema = z.object({
  password: z.string().min(1, "Password is required"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type LockScreenFormData = z.infer<typeof lockScreenSchema>
