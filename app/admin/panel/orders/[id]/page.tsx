'use client'

import AdminOrderDetail from '@/components/admin/order-detail'
import LoadingSpinner from '@/components/general/loader-spinner'
import { adminOrderQueries } from '@/hooks/use-admin-order'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isFetching, isError, error } =
    adminOrderQueries.useGetOrderById(id as string)

  if (isLoading || isFetching) {
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
          href='/admin/panel'
          className='text-sm font-medium text-primary underline-offset-4 hover:underline'
        >
          Back to admin panel
        </Link>
      </div>
    )
  }

  return <AdminOrderDetail order={data.data} />
}
