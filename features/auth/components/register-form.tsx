'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ValidationError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { useRegister } from '../api'
import { registerSchema, type RegisterFormData } from '../schemas'

export function RegisterForm() {
  const { mutateAsync: registerUser, isPending } = useRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser(data)
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof RegisterFormData, {
            type: 'server',
            message: messages[0],
          })
        })
      }
    }
  }

  return (
    <form id="register" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-name">Full Name</FieldLabel>
              <Input
                {...field}
                id="register-name"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="name"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="register-email"
                type="email"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="email"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-password">Password</FieldLabel>
              <Input
                {...field}
                id="register-password"
                type="password"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password_confirmation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-password-confirmation">
                Confirm Password
              </FieldLabel>
              <Input
                {...field}
                id="register-password-confirmation"
                type="password"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4" />}
          {isPending ? 'Creating account...' : 'Create Account'}
        </Button>
      </FieldGroup>
    </form>
  )
}