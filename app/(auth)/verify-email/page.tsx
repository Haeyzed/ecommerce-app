import { Suspense } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { VerifyEmailContent } from '@/features/auth'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            We are verifying your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <Spinner className="h-8 w-8 text-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}