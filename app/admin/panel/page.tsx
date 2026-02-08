'use client'

import AdminOrderCard from '@/components/admin/order-card'
import LoadingSpinner from '@/components/general/loader-spinner'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import { adminOrderQueries } from '@/hooks/use-admin-order'
import { cn } from '@/lib/utils'
import { ScrollText, Users } from 'lucide-react'
import { Fragment, useState } from 'react'

const TAB_MENU_ITEMS = [
  {
    label: 'Orders',
    value: 'orders',
    icon: <ScrollText className='size-4' />,
  },
  {
    label: 'Users',
    value: 'users',
    icon: <Users className='size-4' />,
  },
]

const PAGE_SIZE = 10

function OrdersTab() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = adminOrderQueries.useGetOrdersPaginated(
    page,
    PAGE_SIZE,
  )
  const orders = data?.data ?? []
  const pagination = data?.pagination

  if (isLoading) {
    return <LoadingSpinner message='Loading orders...' />
  }

  if (orders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ScrollText />
          </EmptyMedia>
          <EmptyTitle>No orders found</EmptyTitle>
          <EmptyDescription>There are no orders found.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const totalPages = pagination?.totalPages ?? 1
  const showPrev = page > 1
  const showNext = page < totalPages

  const pageNumbers: number[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)
    if (start > 1) pageNumbers.push(1)
    if (start > 2) pageNumbers.push(-1)
    for (let i = start; i <= end; i++) pageNumbers.push(i)
    if (end < totalPages - 1) pageNumbers.push(-2)
    if (end < totalPages) pageNumbers.push(totalPages)
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {orders.map(order => (
          <AdminOrderCard key={order.id} order={order} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={e => {
                  e.preventDefault()
                  if (showPrev) setPage(p => p - 1)
                }}
                className={cn(!showPrev && 'pointer-events-none opacity-50')}
                aria-disabled={!showPrev}
              />
            </PaginationItem>
            {pageNumbers.map(n =>
              n < 0 ? (
                <PaginationItem key={n}>
                  <span className='flex size-9 items-center justify-center px-0'>
                    …
                  </span>
                </PaginationItem>
              ) : (
                <PaginationItem key={n}>
                  <PaginationLink
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      setPage(n)
                    }}
                    isActive={page === n}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={e => {
                  e.preventDefault()
                  if (showNext) setPage(p => p + 1)
                }}
                className={cn(!showNext && 'pointer-events-none opacity-50')}
                aria-disabled={!showNext}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<string>(TAB_MENU_ITEMS[0].value)

  return (
    <Fragment>
      <h1 className='mb-2 text-2xl font-bold md:text-3xl'>Admin Panel</h1>
      <p className='text-muted-foreground'>
        Welcome to the admin panel. Here you can manage the website and the
        orders.
      </p>
      <Separator className='my-4 md:my-6' />
      {/* Custom Responsive Tabs with shadcn small buttons */}
      <div className='w-full'>
        <div
          className={cn(
            'flex w-full rounded-lg bg-muted p-1.5 mb-2 gap-1.5',
            TAB_MENU_ITEMS.length > 2 && 'overflow-x-auto',
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {TAB_MENU_ITEMS.map(item => (
            <Button
              key={item.value}
              variant={activeTab === item.value ? 'default' : 'ghost'}
              size='sm'
              className={cn(
                'hover:bg-green-700/10 hover:text-green-700 focus:bg-green-700 focus:text-white',
                activeTab === item.value && 'bg-green-700 text-white shadow-sm',
              )}
              onClick={() => setActiveTab(item.value)}
              aria-current={activeTab === item.value ? 'page' : undefined}
              type='button'
            >
              <span className='mr-1'>{item.icon}</span>
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
        <div>
          {activeTab === 'orders' && (
            <div className='mt-6'>
              <OrdersTab />
            </div>
          )}
          {activeTab === 'users' && (
            <div className='mt-6'>
              <p className='text-muted-foreground'>
                Users management coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}
