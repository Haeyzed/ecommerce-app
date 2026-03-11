'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useLogout } from '../api'

export function UserNav() {
  const { mutateAsync: logout, isPending } = useLogout()

  return (
    <Button
      variant="outline"
      onClick={() => logout()}
      disabled={isPending}
    >
      {isPending && <Spinner className="mr-2 h-4 w-4" />}
      {isPending ? 'Logging out...' : 'Log out'}
    </Button>
  )
}