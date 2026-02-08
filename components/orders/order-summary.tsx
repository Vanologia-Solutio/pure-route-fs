'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cart } from '@/shared/types/cart'
import { formatCurrency } from '@/shared/utils/formatter'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import LoadingSpinner from '../general/loader-spinner'

interface OrderSummaryProps {
  items: Cart['products']
  subtotal: number
  shipmentCost: number
  total: number
  mobile?: boolean
  states: {
    isLoading: boolean
  }
}

export default function OrderSummary({
  items,
  subtotal,
  shipmentCost,
  total,
  mobile = false,
  states,
}: OrderSummaryProps) {
  const [isOpen, setIsOpen] = useState(!mobile)

  if (mobile) {
    return (
      // change to accordion
      <Card className='border-slate-200 bg-white shadow-sm'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex w-full items-center justify-between px-6 py-4 hover:bg-slate-50'
        >
          <div className='text-left'>
            <p className='text-sm font-medium'>Order Summary</p>
            <p className='text-2xl font-bold'>{formatCurrency(total)}</p>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform  ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <CardContent className='border-t border-slate-200 pt-4'>
            <ItemsList items={items} />
            <SummaryDetails
              subtotal={subtotal}
              shipmentCost={shipmentCost}
              total={total}
            />
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card className='sticky top-26 border-slate-200 bg-white shadow-sm'>
      <CardHeader>
        <CardTitle className='text-lg'>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {states.isLoading ? (
          <LoadingSpinner message='Loading order summary...' />
        ) : (
          <Fragment>
            <ItemsList items={items} />
            <SummaryDetails
              subtotal={subtotal}
              shipmentCost={shipmentCost}
              total={total}
            />
          </Fragment>
        )}
      </CardContent>
    </Card>
  )
}

function ItemsList({ items }: { items: Cart['products'] }) {
  return (
    <div className='space-y-3 border-b border-slate-200 pb-4'>
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
  total,
}: {
  subtotal: number
  shipmentCost: number
  total: number
}) {
  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <span className='text-sm'>Subtotal</span>
        <span className='font-semibold text-base'>
          {formatCurrency(subtotal)}
        </span>
      </div>
      <div className='flex justify-between'>
        <span className='text-sm'>Shipping</span>
        <span className='font-semibold text-base'>
          {formatCurrency(shipmentCost)}
        </span>
      </div>
      <div className='border-t border-slate-200 pt-3'>
        <div className='flex justify-between'>
          <span className='font-semibold text-lg'>Total</span>
          <span className='text-xl font-bold text-green-700'>
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  )
}
