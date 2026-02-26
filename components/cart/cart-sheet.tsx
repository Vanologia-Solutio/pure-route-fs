'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cartQueries } from '@/hooks/use-cart'
import { formatCurrency } from '@/shared/utils/formatter'
import {
  CreditCard,
  Loader2,
  Minus,
  PackageOpen,
  Plus,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import LoadingSpinner from '../general/loader-spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'

const MIN_QTY = 1
const MAX_QTY = 99
const QTY_DEBOUNCE = 250

type CartSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const router = useRouter()

  const { data: cartRes, isLoading, isFetching } = cartQueries.useGetDetails()

  const { mutate: updateQty, isPending: isUpdatingQty } =
    cartQueries.useUpdateQuantity()
  const { mutate: removeItem, isPending: isRemovingItem } =
    cartQueries.useRemoveItem()

  const [localQty, setLocalQty] = useState<Record<number, number>>({})

  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({})

  const cart = cartRes?.data ?? null
  const products = cart?.products ?? []

  const getQty = useCallback(
    (productId: number, defaultQty: number) =>
      localQty[productId] ?? defaultQty,
    [localQty],
  )

  const handleQtyChangeAndUpdate = useCallback(
    (productId: number, value: number, currentQty: number) => {
      const clamped = Math.min(MAX_QTY, Math.max(MIN_QTY, value))
      setLocalQty(prev => ({ ...prev, [productId]: clamped }))

      if (debounceTimers.current[productId]) {
        clearTimeout(debounceTimers.current[productId])
      }

      debounceTimers.current[productId] = setTimeout(() => {
        if (clamped !== currentQty && clamped >= MIN_QTY) {
          updateQty({ productId, quantity: clamped })
        }
        delete debounceTimers.current[productId]
      }, QTY_DEBOUNCE)
    },
    [updateQty],
  )

  const handleQtyBlur = (productId: number, currentQty: number) => {
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId])
      delete debounceTimers.current[productId]
    }
    const value = getQty(productId, currentQty)
    if (value !== currentQty && value >= MIN_QTY) {
      updateQty({ productId, quantity: value })
    }
    setLocalQty(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  useEffect(() => {
    const timers = debounceTimers.current
    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer))
    }
  }, [])

  const handleRemove = (productId: string) => {
    removeItem(productId)
  }

  const subtotal = products.reduce(
    (sum, p) => sum + p.price * getQty(p.id, p.quantity),
    0,
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-full max-w-full sm:max-w-md'
        showCloseButton
      >
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {cart?.products?.length ?? 0} items in your cart
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto px-4'>
          {isLoading ? (
            <LoadingSpinner message='Loading cart...' />
          ) : products.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <PackageOpen />
                </EmptyMedia>
                <EmptyTitle>Your cart is empty</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t added any items to your cart yet. Get started
                  by adding some items to your cart.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className='flex-row justify-center gap-2'>
                <Link href='/shop' onClick={() => onOpenChange(false)}>
                  <Button className='bg-green-700 text-white hover:bg-green-800'>
                    Continue Shopping
                  </Button>
                </Link>
              </EmptyContent>
            </Empty>
          ) : (
            <ul className='space-y-4'>
              {products.map(item => (
                <li
                  key={item.id}
                  className='flex flex-col gap-2 border-b border-border pb-4 last:border-0'
                >
                  <div className='flex items-center gap-4 w-full'>
                    <div className='flex items-center shrink-0'>
                      <Image
                        src={item.file_path}
                        alt={item.name}
                        width={60}
                        height={60}
                        className='rounded-md'
                      />
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <div className='flex items-end justify-between gap-2'>
                        <div className='flex flex-col items-start gap-0.5'>
                          <p className='font-semibold text-sm'>{item.name}</p>
                          <p className='text-xs text-muted-foreground line-clamp-1'>
                            {item.description}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 size-8'
                              disabled={
                                isUpdatingQty || isFetching || isRemovingItem
                              }
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent size='sm'>
                            <AlertDialogHeader>
                              <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
                                <Trash2 />
                              </AlertDialogMedia>
                              <AlertDialogTitle>
                                Remove item from cart?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove {item.name} from your cart.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant='destructive'
                                onClick={() => handleRemove(item.id.toString())}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className='flex items-center justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                          <label htmlFor={`qty-${item.id}`} className='sr-only'>
                            Quantity for {item.name}
                          </label>
                          <div className='flex items-center'>
                            <Button
                              type='button'
                              size='icon'
                              variant='outline'
                              onClick={() =>
                                handleQtyChangeAndUpdate(
                                  item.id,
                                  getQty(item.id, item.quantity) - 1,
                                  item.quantity,
                                )
                              }
                              disabled={
                                getQty(item.id, item.quantity) <= MIN_QTY ||
                                isUpdatingQty ||
                                isFetching ||
                                isRemovingItem
                              }
                              className='rounded-r-none rounded-l-md size-7 sm:size-8'
                              aria-label={`Decrease quantity for ${item.name}`}
                            >
                              <Minus className='size-3 sm:size-4' />
                            </Button>
                            <Input
                              id={`qty-${item.id}`}
                              type='number'
                              min={MIN_QTY}
                              max={MAX_QTY}
                              value={getQty(item.id, item.quantity)}
                              onChange={e => {
                                const v = e.target.valueAsNumber
                                if (!Number.isNaN(v)) {
                                  setLocalQty(prev => ({
                                    ...prev,
                                    [item.id]: Math.floor(v),
                                  }))
                                }
                              }}
                              onBlur={() =>
                                handleQtyBlur(item.id, item.quantity)
                              }
                              className='w-14 sm:w-16 h-7 sm:h-8 text-center border-x-0 [appearance:textfield] rounded-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                              disabled={
                                isUpdatingQty || isFetching || isRemovingItem
                              }
                            />
                            <Button
                              type='button'
                              size='icon'
                              variant='outline'
                              onClick={() =>
                                handleQtyChangeAndUpdate(
                                  item.id,
                                  getQty(item.id, item.quantity) + 1,
                                  item.quantity,
                                )
                              }
                              disabled={
                                getQty(item.id, item.quantity) >= MAX_QTY ||
                                isUpdatingQty ||
                                isFetching ||
                                isRemovingItem
                              }
                              className='rounded-l-none rounded-r-md size-7 sm:size-8'
                              aria-label={`Increase quantity for ${item.name}`}
                            >
                              <Plus className='size-3 sm:size-4' />
                            </Button>
                          </div>
                        </div>
                        <span className='font-medium text-green-700 dark:text-green-400'>
                          {formatCurrency(
                            item.price * getQty(item.id, item.quantity),
                          )}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {products.length > 0 && (
          <SheetFooter className='flex flex-col gap-2 sm:flex-col'>
            <div className='flex justify-between text-base font-semibold w-full'>
              <span>Subtotal</span>
              <span className='text-lg font-bold text-green-700'>
                {formatCurrency(subtotal)}
              </span>
            </div>
            <Button
              size='lg'
              className='w-full bg-green-700 text-white hover:bg-green-800'
              onClick={() => {
                onOpenChange(false)
                router.push('/checkout')
              }}
              disabled={
                isLoading || isFetching || isRemovingItem || isUpdatingQty
              }
            >
              {isLoading || isFetching || isRemovingItem || isUpdatingQty ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <CreditCard className='size-4' />
              )}
              Proceed to Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
