'use client'

import * as React from 'react'
import { useAuthSession } from '../api'
import { LockScreenForm } from '@/features/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function LockScreenContent() {
  const { data: session } = useAuthSession()
  const userName = session?.user?.name ?? 'User'
  const userEmail = session?.user?.email ?? ''
  const userImage = session?.user?.image_url ?? undefined

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="h-24 w-24">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{userName}</h2>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <LockScreenForm />
      </div>
    </div>
  )
}