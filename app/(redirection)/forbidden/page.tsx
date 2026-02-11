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
import { ArrowLeft, MessageCircle, ShieldX } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForbiddenPage() {
  const router = useRouter()

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-120px)] p-4 lg:px-0 lg:py-4'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ShieldX />
          </EmptyMedia>
          <EmptyTitle>403 - Forbidden</EmptyTitle>
          <EmptyDescription>
            You are not allowed to access this page. Please contact our support
            team if you believe this is a mistake.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex gap-2 justify-center items-center'>
            <Button variant='outline' onClick={() => router.back()}>
              <ArrowLeft className='size-4' />
              Go back
            </Button>
            <Button
              className='bg-green-700 text-white hover:bg-green-800'
              onClick={() => router.push('/support')}
            >
              <MessageCircle className='size-4' />
              Contact Support
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
