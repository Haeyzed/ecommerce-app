import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RegisterForm } from '@/features/auth'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function RegisterPage() {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>Create an account</CardTitle>
        <CardDescription>
            Complete the steps below to create your account.
            </CardDescription>
      </CardHeader>
      <CardContent>
          <Suspense
            fallback={
              <div className="flex justify-center py-6">
                <Spinner className="h-6 w-6 text-primary" />
              </div>
            }
          >
            <RegisterForm />
          </Suspense>
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href="/login"
              className='text-primary hover:underline'
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
  )
}