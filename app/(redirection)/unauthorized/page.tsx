'use client'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { useAuthStore } from '@/shared/stores/auth-store'
import { Lock, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { signOut } = useAuthStore()

  const handleLogin = () => {
    signOut()
    router.replace('/login')
  }

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-120px)] p-4 lg:px-0 lg:py-4'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Lock />
          </EmptyMedia>
          <EmptyTitle>401 - Unauthorized</EmptyTitle>
          <EmptyDescription>
            You are not authorized to access this page. Please login to
            continue.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            className='bg-green-700 text-white hover:bg-green-800'
            onClick={handleLogin}
          >
            <LogIn className='size-4' />
            Go to Login
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
