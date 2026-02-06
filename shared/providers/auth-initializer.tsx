'use client'

import { useAuthStore } from '@/shared/stores/auth-store'
import { ReactNode, useEffect } from 'react'

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const { initialize, isInitializing } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isInitializing) return null

  return children
}
