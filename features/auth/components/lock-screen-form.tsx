'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ValidationError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'

import { useUnlock } from '../api'
import { lockScreenSchema, type LockScreenFormData } from '../schemas'

export function LockScreenForm() {
  const { mutateAsync: unlock, isPending } = useUnlock()

  const form = useForm<LockScreenFormData>({
    resolver: zodResolver(lockScreenSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(data: LockScreenFormData) {
    try {
      await unlock(data)
    } catch (error) {
      if (error instanceof ValidationError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof LockScreenFormData, {
            type: 'server',
            message: messages[0],
          })
        })
      }
    }
  }

  return (
    <form id="lock" onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <FieldGroup className="space-y-4">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="lock-password"
                type="password"
                placeholder="Enter password to unlock"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                className="text-center"
              />
              {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4" />}
          {isPending ? 'Unlocking...' : 'Unlock'}
        </Button>
      </FieldGroup>
    </form>
  )
}