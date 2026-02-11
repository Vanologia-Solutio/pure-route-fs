import LoadingSpinner from '@/components/general/loader-spinner'

export default function Loading() {
  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-120px)] p-4 lg:px-0 lg:py-4'>
      <LoadingSpinner size='xl' message='Loading...' />
    </div>
  )
}
