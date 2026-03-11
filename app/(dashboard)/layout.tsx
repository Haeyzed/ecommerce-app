import { redirect } from 'next/navigation'
import Link from 'next/link'

import { auth } from '@/auth'
import { UserNav } from '@/features/auth/components/user-nav'

export default async function DashboardLayout({
                                                children,
                                              }: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <aside className="w-full border-r bg-muted/40 md:w-64 md:flex-col md:min-h-screen p-4">
        <div className="flex h-14 items-center border-b pb-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="">Your App</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 pt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
          >
            Dashboard
          </Link>
        </nav>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="font-medium text-sm text-muted-foreground">
            Welcome, {session.user.name}
          </div>
          <UserNav />
        </header>

        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}