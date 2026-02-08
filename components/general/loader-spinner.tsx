import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({
  size = 'lg',
  message = 'Loading...',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  message?: string
}) {
  const sizeMap = {
    xs: 'size-4',
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-10',
    xl: 'size-12',
  }
  const sizeClass = sizeMap[size]

  return (
    <div className='flex flex-col min-h-[25vh] items-center justify-center gap-4 p-12'>
      <Loader2 className={cn('animate-spin', sizeClass)} />
      <p className='font-medium'>{message}</p>
    </div>
  )
}
