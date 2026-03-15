import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RegisterForm } from "@/features/auth"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"

export default function RegisterPage() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Create an account
        </CardTitle>
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
      <CardFooter className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
