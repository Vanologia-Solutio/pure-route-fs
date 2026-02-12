'use client'

import LoadingSpinner from '@/components/general/loader-spinner'
import { useEffect } from 'react'

export default function CallbackPage() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const redirectUrl = searchParams.get('redirect_url')
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }, [])

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-120px)] p-4 lg:px-0 lg:py-4'>
      <LoadingSpinner size='xl' message='Redirecting...' />
    </div>
  )
}
