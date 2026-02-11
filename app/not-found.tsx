'use client'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SubmitEvent } from 'react'

export default function NotFoundPage() {
  const router = useRouter()

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    router.push(`/${search}`)
  }

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-120px)] p-4 lg:px-0 lg:py-4'>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <form onSubmit={handleSearch} className='sm:w-3/4'>
            <Input name='search' placeholder='Try searching for pages...' />
          </form>
          <EmptyDescription>
            Need help? <Link href='/support'>Contact support</Link>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  )
}
