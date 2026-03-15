"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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

import { useForgotPassword } from "../api"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas"

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const { mutateAsync: sendResetLink, isPending } = useForgotPassword()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await sendResetLink(data)
      setIsSubmitted(true)
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof ForgotPasswordFormData, {
            type: "server",
            message: messages[0],
          })
        })
      }
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">
        If an account exists for that email, we have sent password reset
        instructions.
      </div>
    )
  }

  return (
    <form id="forgot" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="forgot-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4" />}
          {isPending ? "Sending link..." : "Send Reset Link"}
        </Button>
      </FieldGroup>
    </form>
  )
}
