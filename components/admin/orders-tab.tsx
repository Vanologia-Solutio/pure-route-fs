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
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
import { ScrollText } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'

const PAGE_SIZE = 10

export default function OrdersTab() {
  const [page, setPage] = useState(1)
  const [keywordInput, setKeywordInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(keywordInput)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [keywordInput])

  const { data, isLoading } = adminOrderQueries.useGetOrdersPaginated(
    page,
    PAGE_SIZE,
    keyword,
    status,
  )
  const orders = data?.data ?? []
  const pagination = data?.pagination

  if (isLoading) {
    return <LoadingSpinner message='Loading orders...' />
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
      <div className='flex flex-wrap items-center gap-3'>
        <Input
          value={keywordInput}
          onChange={e => setKeywordInput(e.target.value)}
          placeholder='Search order code, recipient, contact...'
          className='w-full sm:max-w-sm'
        />
        <Select
          value={status}
          onValueChange={value => {
            setStatus(value)
            setPage(1)
          }}
        >
          <SelectTrigger className='w-full sm:w-48'>
            <SelectValue placeholder='Filter status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={OrderStatus.PAID}>Paid</SelectItem>
            <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
            <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <ScrollText />
            </EmptyMedia>
            <EmptyTitle>No orders found</EmptyTitle>
            <EmptyDescription>
              Try another keyword or status filter.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Fragment>
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
                    onClick={e => {
                      e.preventDefault()
                      if (showPrev) setPage(p => p - 1)
                    }}
                    className={cn(
                      !showPrev && 'pointer-events-none opacity-50',
                    )}
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
                    onClick={e => {
                      e.preventDefault()
                      if (showNext) setPage(p => p + 1)
                    }}
                    className={cn(
                      !showNext && 'pointer-events-none opacity-50',
                    )}
                    aria-disabled={!showNext}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </Fragment>
      )}
    </div>
  )
}
