'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Cart } from '@/shared/types/cart'
import { ValidatedPromotion } from '@/shared/types/promotion'
import { formatCurrency } from '@/shared/utils/formatter'
import { Check, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { Fragment, SubmitEvent } from 'react'
import LoadingSpinner from '../general/loader-spinner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

interface OrderSummaryProps {
  items: Cart['products']
  subtotal: number
  shipmentCost: number
  discount?: number
  total: number
  mobile?: boolean
  states: {
    isLoading: boolean
  }
  promotion?: {
    details: ValidatedPromotion | null
    isLoading: boolean
    disabled: boolean
    onApply: (code: string) => void
    onRemove: () => void
  }
}

export default function OrderSummary({
  items,
  subtotal,
  shipmentCost,
  discount = 0,
  total,
  mobile = false,
  states,
  promotion,
}: OrderSummaryProps) {
  const promotionSection = promotion ? (
    <PromotionCodeSection
      promotion={promotion}
      compact={mobile}
      mobile={mobile}
    />
  ) : null

  if (mobile) {
    return (
      <Accordion
        type='single'
        collapsible
        className='w-full border rounded-lg shadow-sm'
      >
        <AccordionItem value='order-summary' className='border-0'>
          <AccordionTrigger className='p-4 hover:bg-slate-50 [&[data-state=open]>svg]:rotate-180 transition-colors'>
            {states.isLoading ? (
              <Skeleton className='w-full h-12' />
            ) : (
              <div className='text-left'>
                <p className='text-sm sm:text-base font-medium'>
                  Order Summary
                </p>
                <p className='text-xl sm:text-2xl font-bold'>
                  {formatCurrency(total)}
                </p>
              </div>
            )}
          </AccordionTrigger>
          <AccordionContent className='p-4'>
            <ItemsList items={items} />
            <Separator className='my-4' />
            <SummaryDetails
              subtotal={subtotal}
              shipmentCost={shipmentCost}
              discount={discount}
              total={total}
            />
            {promotionSection}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  return (
    <Card className='sticky top-24 border-slate-200 bg-white shadow-sm'>
      <CardHeader>
        <CardTitle className='text-lg'>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {states.isLoading ? (
          <LoadingSpinner message='Loading order summary...' />
        ) : (
          <Fragment>
            <ItemsList items={items} />
            <Separator />
            <SummaryDetails
              subtotal={subtotal}
              shipmentCost={shipmentCost}
              discount={discount}
              total={total}
            />
            {promotionSection}
          </Fragment>
        )}
      </CardContent>
    </Card>
  )
}

function PromotionCodeSection({
  promotion,
  compact,
  mobile = false,
}: {
  promotion: NonNullable<OrderSummaryProps['promotion']>
  compact?: boolean
  mobile?: boolean
}) {
  const { details, isLoading, disabled, onApply, onRemove } = promotion
  const isDisabled = disabled || isLoading

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const code = formData.get('code') as string
    if (!code.trim()) return
    onApply(code.trim())
  }

  if (details) {
    return (
      <div className={cn(mobile && 'mt-22')}>
        <div className='flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2'>
          <div className='flex items-center gap-2 min-w-0'>
            <Check className='size-4 shrink-0 text-green-700' />
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium text-green-800 truncate'>
                {details.code} applied
              </p>
              {details.description && !compact && (
                <p className='text-xs text-muted-foreground truncate'>
                  {details.description}
                </p>
              )}
            </div>
          </div>
          <Button
            type='button'
            size='icon'
            variant='ghost'
            className='shrink-0 text-red-700 hover:bg-red-100 hover:text-red-900 size-8'
            disabled={isDisabled}
            onClick={() => onRemove()}
          >
            <X className='size-4' />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn(mobile && 'mt-2')}>
      <div className='flex gap-2'>
        <Input
          className='flex-1 min-w-0 text-sm'
          name='code'
          placeholder='Promotion code'
          disabled={isDisabled}
          required
        />
        <Button
          type='submit'
          size='sm'
          className='shrink-0'
          disabled={isDisabled}
        >
          {isLoading ? <Loader2 className='size-4 animate-spin' /> : 'Apply'}
        </Button>
      </div>
    </form>
  )
}

function ItemsList({ items }: { items: Cart['products'] }) {
  return (
    <div className='space-y-3'>
      {items.map(item => (
        <div key={item.id} className='flex items-center justify-between gap-2'>
          <div className='relative flex items-center gap-2 shrink-0'>
            <Image
              src={item.file_path}
              alt={item.name}
              width={48}
              height={48}
              className='rounded-md'
            />
            <span className='absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 rounded-full text-xs font-medium bg-green-700 text-white aspect-square w-fit min-w-4.5 h-4.5'>
              {item.quantity}
            </span>
          </div>
          <div className='space-y-0.5 flex-1'>
            <p className='text-sm font-medium'>{item.name}</p>
            <p className='text-xs text-muted-foreground'>
              {formatCurrency(item.price)}
            </p>
          </div>
          <p className='text-sm font-semibold'>
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      ))}
    </div>
  )
}

function SummaryDetails({
  subtotal,
  shipmentCost,
  discount = 0,
  total,
}: {
  subtotal: number
  shipmentCost: number
  discount?: number
  total: number
}) {
  return (
    <div className='space-y-2 sm:space-y-3'>
      <div className='flex justify-between'>
        <span className='text-xs sm:text-sm'>Subtotal</span>
        <span className='font-semibold text-sm sm:text-base'>
          {formatCurrency(subtotal)}
        </span>
      </div>
      <div className='flex justify-between'>
        <span className='text-xs sm:text-sm'>Shipping</span>
        <span className='font-semibold text-sm sm:text-base'>
          {formatCurrency(shipmentCost)}
        </span>
      </div>
      {discount > 0 && (
        <div className='flex justify-between text-green-700'>
          <span className='text-xs sm:text-sm'>Discount</span>
          <span className='font-semibold text-sm sm:text-base'>
            -{formatCurrency(discount)}
          </span>
        </div>
      )}
      <div className='border-t border-slate-200 pt-3'>
        <div className='flex justify-between'>
          <span className='font-semibold text-base sm:text-lg'>Total</span>
          <span className='text-lg sm:text-xl font-bold text-green-700'>
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  )
}
