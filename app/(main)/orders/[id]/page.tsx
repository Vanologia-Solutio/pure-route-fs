'use client'

import LoadingSpinner from '@/components/general/loader-spinner'
import OrderDetail from '@/components/orders/order-detail'
import { orderQueries } from '@/hooks/use-order'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function OrderPage() {
  const { id } = useParams()
  const { data, isLoading, isError, error } = orderQueries.useGetById(
    id as string,
  )

  if (isLoading) {
    return <LoadingSpinner message='Loading order details...' />
  }

  if (isError || !data?.data) {
    return (
      <div className='flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 py-12'>
        <AlertCircle className='size-10 text-destructive' />
        <p className='text-center text-lg font-medium'>
          {data?.message ?? (error as Error)?.message ?? 'Order not found'}
        </p>
        <Link
          href='/orders'
          className='text-sm font-medium text-primary underline-offset-4 hover:underline'
        >
          Back to orders
        </Link>
      </div>
    )
  }

  return <OrderDetail order={data.data} />
}
