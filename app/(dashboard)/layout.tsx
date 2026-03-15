import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const greeting = (
    <span className="text-sm font-medium text-muted-foreground">
      Welcome, {session.user.name ?? "User"}
    </span>
  )

  return <DashboardShell greeting={greeting}>{children}</DashboardShell>
}
