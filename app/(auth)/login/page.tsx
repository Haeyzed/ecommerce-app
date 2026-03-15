import Link from 'next/link'
import { Suspense } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { LoginForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password below to <br />
          log into your account
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Suspense
            fallback={
              <div className="flex py-6 justify-center">
                <Spinner className="h-6 w-6 text-primary" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className='flex flex-col items-center gap-3'>
          <p className='text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up
            </Link>
          </p>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking sign in, you agree to our{' '}
            <Link
              href="/terms"
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
  )
}
