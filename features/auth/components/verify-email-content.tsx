'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { useVerifyEmail } from '../api'

export function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const { mutateAsync: verifyEmail } = useVerifyEmail()

  React.useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    async function verify() {
      try {
        await verifyEmail(token as string)
        setStatus('success')
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } catch {
        setStatus('error')
      }
    }

    verify()
  }, [token, verifyEmail, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Spinner className="h-8 w-8 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">
          Verifying your email...
        </h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we confirm your token.
        </p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-green-700">
          Email Verified!
        </h2>
        <p className="text-sm text-muted-foreground">
          Redirecting to your dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-destructive">
        Verification Failed
      </h2>
      <p className="text-sm text-muted-foreground">
        The link is invalid or has expired.
      </p>
      <Button asChild className="mt-4 w-full sm:w-auto">
        <Link href="/login">Return to Login</Link>
      </Button>
    </div>
  )
}