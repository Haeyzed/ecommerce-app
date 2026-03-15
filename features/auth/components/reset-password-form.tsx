"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"

import { ValidationError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { useResetPassword } from "../api"
import { resetPasswordSchema, type ResetPasswordFormData } from "../schemas"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const { mutateAsync: resetPassword, isPending } = useResetPassword()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? "",
      email: email ?? "",
      password: "",
      password_confirmation: "",
    },
  })

  React.useEffect(() => {
    if (token) form.setValue("token", token)
    if (email) form.setValue("email", email)
  }, [token, email, form])

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await resetPassword(data)
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof ResetPasswordFormData, {
            type: "server",
            message: messages[0],
          })
        })
      }
    }
  }

  return (
    <form id="reset" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-4">
        <input type="hidden" {...form.register("token")} />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="reset-email"
                type="email"
                readOnly
                className="bg-muted"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-password">New Password</FieldLabel>
              <Input
                {...field}
                id="reset-password"
                type="password"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password_confirmation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-password-confirmation">
                Confirm New Password
              </FieldLabel>
              <Input
                {...field}
                id="reset-password-confirmation"
                type="password"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {form.formState.errors.token && (
          <p className="text-sm font-medium text-destructive">
            Invalid password reset token.
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4" />}
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </FieldGroup>
    </form>
  )
}
