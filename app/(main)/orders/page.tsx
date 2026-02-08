'use client'

import LoadingSpinner from '@/components/general/loader-spinner'
import OrderCard from '@/components/orders/order-card'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { orderQueries } from '@/hooks/use-order'
import { ScrollText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'

export default function OrdersPage() {
  const router = useRouter()
  const { data, isLoading } = orderQueries.useGetList()
  const orders = data?.data ?? []

  return (
    <Fragment>
      <h1 className='text-2xl font-bold mb-4 md:text-3xl'>Orders</h1>

      {isLoading ? (
        <LoadingSpinner message='Loading orders...' />
      ) : orders.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <ScrollText />
            </EmptyMedia>
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptyDescription>
              Orders you place will appear here. Go to the shop to start
              shopping.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              className='bg-green-700 text-white hover:bg-green-800'
              onClick={() => router.push('/shop')}
            >
              Go to shop
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </Fragment>
  )
}
