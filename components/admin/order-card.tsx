'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AdminOrderListItem } from '@/services/admin-order-service'
import {
  formatCurrency,
  formatDateTime,
  statusVariantClassName,
} from '@/shared/utils/formatter'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrderCard({
  order,
}: {
  order: AdminOrderListItem
}) {
  const shippingAddress = [
    order.address,
    [order.city, order.state].filter(Boolean).join(', '),
    order.postal_code,
    order.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Link
      href={`/admin/panel/orders/${order.id}`}
      className='block transition-opacity hover:opacity-75 duration-200 group'
    >
      <Card className='h-full gap-2 border-slate-200 bg-white shadow-sm'>
        <CardHeader className='flex flex-row items-start justify-between gap-2 pb-2'>
          <div className='min-w-0'>
            <CardTitle className='truncate text-lg text-green-700'>
              {order.code}
            </CardTitle>
            <CardDescription className='mt-0.5'>
              {formatDateTime(order.creation_date)}
            </CardDescription>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              statusVariantClassName(order.status),
            )}
          >
            {order.status}
          </span>
        </CardHeader>
        <CardContent className='space-y-1.5'>
          <p className='text-sm font-semibold'>{order.recipient_name}</p>
          <p
            className='text-xs text-muted-foreground truncate'
            title={order.contact_info}
          >
            {order.contact_info}
          </p>
          <p className='text-xs text-muted-foreground'>{order.country}</p>
          <p
            className='text-xs text-muted-foreground line-clamp-1'
            title={shippingAddress}
          >
            {shippingAddress || '—'}
          </p>
          <div className='flex items-center justify-between pt-2'>
            <span className='text-lg font-bold'>
              {formatCurrency(order.total_amount)}
            </span>
            <ChevronRight className='size-5 shrink-0 text-muted-foreground' />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
