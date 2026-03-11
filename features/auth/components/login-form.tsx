'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

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

import { useLogin } from '../api'
import { loginSchema, type LoginFormData } from '../schemas'

export function LoginForm() {
  const { mutateAsync: login, isPending } = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof LoginFormData, {
            type: 'server',
            message: messages[0],
          })
        })
      }
    }
  }

  return (
    <form id="login" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-4">
        <Controller
          name="identifier"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-identifier">
                Email or Username
              </FieldLabel>
              <Input
                {...field}
                id="login-identifier"
                placeholder="Enter your email or username"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="username"
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
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder="Enter your password"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4" />}
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </FieldGroup>
    </form>
  )
}