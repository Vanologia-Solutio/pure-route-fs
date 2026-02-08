'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  formatCurrency,
  formatDateTime,
  statusVariantClassName,
} from '@/shared/utils/formatter'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export type OrderCardItem = {
  id: number
  code: string
  status: string
  total_amount: number
  creation_date: string
}

export default function OrderCard({ order }: { order: OrderCardItem }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className='block transition-opacity hover:opacity-75 duration-200 group'
    >
      <Card className='h-full group-hover:shadow-md duration-200'>
        <CardHeader className='flex flex-row items-start justify-between gap-2'>
          <div className='min-w-0'>
            <CardTitle className='truncate text-base sm:text-lg text-green-700'>
              {order.code}
            </CardTitle>
            <CardDescription className='mt-0.5 text-xs sm:text-sm'>
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
        <CardContent className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <p className='text-xs text-muted-foreground'>Total Amount</p>
            <span className='text-base sm:text-lg font-bold'>
              {formatCurrency(order.total_amount)}
            </span>
          </div>
          <ChevronRight className='size-5 shrink-0 text-muted-foreground' />
        </CardContent>
      </Card>
    </Link>
  )
}
