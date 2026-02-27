'use client'

import CreatePromotionDialog from '@/components/admin/create-promotion-dialog'
import PromotionCard from '@/components/admin/promotion-card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { promotionQueries } from '@/hooks/use-promotion'
import { cn } from '@/lib/utils'
import { ScrollText } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingSpinner from '../general/loader-spinner'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'

const PAGE_SIZE = 15

export default function PromotionsTab() {
  const [page, setPage] = useState(1)
  const [keywordInput, setKeywordInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [updatingPromotionId, setUpdatingPromotionId] = useState<number | null>(
    null,
  )

  const {
    data: promotions,
    isLoading: isLoadingPromotions,
    isFetching: isFetchingPromotions,
  } = promotionQueries.useGetList(page, PAGE_SIZE, keyword)
  const { mutateAsync: updateStatus } = promotionQueries.useUpdateStatus()
  const promoList = promotions?.data ?? []
  const pagination = promotions?.pagination

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(keywordInput)
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [keywordInput])

  if (isLoadingPromotions || isFetchingPromotions) {
    return <LoadingSpinner message='Loading promotions...' />
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

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      setUpdatingPromotionId(id)
      const res = await updateStatus({ id, isActive: !isActive })
      if (res.success) {
        toast.success(
          `Promotion ${!isActive ? 'activated' : 'deactivated'} successfully`,
        )
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update promotion status',
      )
    } finally {
      setUpdatingPromotionId(null)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <Input
          disabled={promoList.length === 0 && !isFetchingPromotions}
          value={keywordInput}
          onChange={e => setKeywordInput(e.target.value)}
          placeholder={
            promoList.length === 0 && !isFetchingPromotions
              ? 'No promotions found'
              : 'Search promo code...'
          }
          className='w-full sm:max-w-sm'
        />
        <CreatePromotionDialog />
      </div>

      {promoList.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <ScrollText />
            </EmptyMedia>
            <EmptyTitle>No promotions found</EmptyTitle>
            <EmptyDescription>
              Try another keyword or create a new promotion.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Fragment>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {promoList.map(p => (
              <PromotionCard
                key={p.id}
                promotion={p}
                onToggleStatus={promotion =>
                  handleToggleStatus(promotion.id, promotion.is_active)
                }
                isUpdatingStatus={updatingPromotionId === p.id}
              />
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
