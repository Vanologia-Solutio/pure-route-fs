'use client'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { adminOrderQueries } from '@/hooks/use-admin-order'
import { cn } from '@/lib/utils'
import { OrderStatus } from '@/shared/enums/status'
import { Order, OrderItem } from '@/shared/types/order'
import {
  formatCurrency,
  formatDateTime,
  statusVariantClassName,
} from '@/shared/utils/formatter'
import { ArrowLeft, Calendar, CreditCard, MapPin, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type OrderItemWithImage = OrderItem & { file_path?: string }

type AdminOrderDetailProps = {
  order: Order & { items: OrderItemWithImage[] }
}

const ORDER_STATUS_OPTIONS = [
  OrderStatus.PENDING,
  OrderStatus.PAID,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
]

export default function AdminOrderDetail({ order }: AdminOrderDetailProps) {
  const updateStatus = adminOrderQueries.useUpdateOrderStatus()

  const fullAddress = [
    order.address,
    [order.city, order.state].filter(Boolean).join(', '),
    order.postal_code,
    order.country,
  ]
    .filter(Boolean)
    .join(', ')

  const handleStatusChange = (value: string) => {
    updateStatus.mutate({ id: String(order.id), status: value })
  }

  return (
    <div className='mx-auto w-full space-y-4 sm:space-y-6'>
      <Link
        href='/admin/panel'
        className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group'
      >
        <ArrowLeft className='size-4' />
        Back to admin panel
      </Link>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2'>
            <h1 className='font-bold text-lg sm:text-2xl order-last sm:order-first'>
              Order: <span className='text-green-700'>{order.code}</span>
            </h1>
            <Badge
              className={cn(
                'w-fit capitalize text-[0.625rem] sm:text-xs',
                statusVariantClassName(order.status as OrderStatus),
              )}
            >
              {order.status}
            </Badge>
          </div>
          <p className='mt-1 text-sm text-muted-foreground'>
            Placed on {formatDateTime(order.creation_date)}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground whitespace-nowrap'>
            Update status:
          </span>
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent position='popper'>
              {ORDER_STATUS_OPTIONS.map(status => (
                <SelectItem key={status} value={status}>
                  <span className='capitalize'>{status}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-5'>
        <div className='space-y-6 lg:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Package className='size-5' />
                Items
              </CardTitle>
              <CardDescription>
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}{' '}
                in this order
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {order.items.map((item: OrderItemWithImage) => (
                <div
                  key={item.id}
                  className='flex items-center gap-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0'
                >
                  <div className='relative size-12 shrink-0 overflow-hidden rounded-md sm:size-16'>
                    {item.file_path ? (
                      <Image
                        src={item.file_path}
                        alt={item.product_name}
                        fill
                        className='object-cover'
                        sizes='64px'
                      />
                    ) : (
                      <div className='flex size-full items-center justify-center text-xs text-muted-foreground'>
                        No image
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium sm:text-base'>
                      {item.product_name}
                    </p>
                    <p className='text-xs text-muted-foreground sm:text-sm'>
                      Qty: {item.quantity} ×{' '}
                      {formatCurrency(item.price_snapshot)}
                    </p>
                  </div>
                  <p className='shrink-0 font-semibold sm:text-lg'>
                    {formatCurrency(item.price_snapshot * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span className='font-medium'>
                  {formatCurrency(order.subtotal_amount)}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Shipping</span>
                <span className='font-medium'>
                  {formatCurrency(order.delivery_fee_snapshot)}
                </span>
              </div>
              <div className='border-t border-slate-200 pt-3 dark:border-slate-800'>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Total</span>
                  <span className='text-lg font-bold text-green-700'>
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <MapPin className='size-5' />
                Shipping address
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-1 text-sm'>
              <p className='font-medium'>{order.recipient_name}</p>
              <p className='text-muted-foreground'>{fullAddress}</p>
              {order.phone_no && (
                <p className='text-muted-foreground'>Phone: {order.phone_no}</p>
              )}
              <p className='text-muted-foreground'>
                Email: {order.contact_info}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <CreditCard className='size-5' />
                Payment & delivery
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Payment</span>
                <span className='font-medium capitalize'>
                  {order.payment_method?.replace(/-/g, ' ') ?? '—'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Shipment</span>
                <span className='font-medium'>
                  {order.shipment_method ??
                    (order.shipment_methods as { code?: string })?.code ??
                    '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Calendar className='size-5' />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-3 text-sm'>
                <li className='flex justify-between'>
                  <span className='text-muted-foreground'>Placed</span>
                  <span>{formatDateTime(order.creation_date)}</span>
                </li>
                {order.paid_at && (
                  <li className='flex justify-between'>
                    <span className='text-muted-foreground'>Paid</span>
                    <span>{formatDateTime(order.paid_at)}</span>
                  </li>
                )}
                {order.shipped_at && (
                  <li className='flex justify-between'>
                    <span className='text-muted-foreground'>Shipped</span>
                    <span>{formatDateTime(order.shipped_at)}</span>
                  </li>
                )}
                {order.delivered_at && (
                  <li className='flex justify-between'>
                    <span className='text-muted-foreground'>Delivered</span>
                    <span>{formatDateTime(order.delivered_at)}</span>
                  </li>
                )}
                {order.completed_at && (
                  <li className='flex justify-between'>
                    <span className='text-muted-foreground'>Completed</span>
                    <span>{formatDateTime(order.completed_at)}</span>
                  </li>
                )}
                {order.cancelled_at && (
                  <li className='flex justify-between text-destructive'>
                    <span>Cancelled</span>
                    <span>{formatDateTime(order.cancelled_at)}</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
