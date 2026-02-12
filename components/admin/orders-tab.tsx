'use client'

import AdminOrderCard from '@/components/admin/order-card'
import LoadingSpinner from '@/components/general/loader-spinner'
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
import { adminOrderQueries } from '@/hooks/use-admin-order'
import { cn } from '@/lib/utils'
import { ScrollText } from 'lucide-react'
import { useState } from 'react'

const PAGE_SIZE = 10

export default function OrdersTab() {
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
