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
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

const MIN_QTY = 1
const MAX_QTY = 99

type CartSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: string
}

export default function CartSheet({
  open,
  onOpenChange,
  role,
}: CartSheetProps) {
  const router = useRouter()
  const {
    data: cartRes,
    isLoading,
    isFetching,
  } = cartQueries.useGetDetails(role?.toLowerCase() ?? '')

  const updateQty = cartQueries.useUpdateQuantity()
  const { mutate: removeItem, isPending: isRemovingItem } =
    cartQueries.useRemoveItem()

  const [localQty, setLocalQty] = useState<Record<string, number>>({})

  const cart = cartRes?.data ?? null
  const products = cart?.products ?? []

  const getQty = useCallback(
    (productId: string, defaultQty: number) =>
      localQty[productId] ?? defaultQty,
    [localQty],
  )
  const setQty = useCallback((productId: string, value: number) => {
    const clamped = Math.min(MAX_QTY, Math.max(MIN_QTY, value))
    setLocalQty(prev => ({ ...prev, [productId]: clamped }))
  }, [])

  const handleQtyBlur = (productId: string, currentQty: number) => {
    const value = getQty(productId, currentQty)
    if (value !== currentQty && value >= MIN_QTY) {
      updateQty.mutate({ productId, quantity: value })
    }
    setLocalQty(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  const handleRemove = (productId: string) => {
    removeItem(productId)
  }

  const subtotal = products.reduce(
    (sum, p) => sum + p.price * getQty(p.id, p.quantity),
    0,
  )

  const handleProceedToCheckout = () => {
    onOpenChange(false)
    router.push('/checkout')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' showCloseButton>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {cart?.products?.length ?? 0} items in your cart
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto px-4'>
          {isLoading || isFetching || isRemovingItem ? (
            <p className='text-muted-foreground text-sm'>Loading cart...</p>
          ) : products.length === 0 ? (
            <p className='text-muted-foreground text-sm'>Your cart is empty.</p>
          ) : (
            <ul className='space-y-4'>
              {products.map(item => (
                <li
                  key={item.id}
                  className='flex flex-col gap-2 border-b border-border pb-4 last:border-0'
                >
                  <div className='flex justify-between gap-2'>
                    <span className='font-medium text-sm'>{item.name}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8'
                      onClick={() => handleRemove(item.id)}
                      disabled={isRemovingItem}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className='size-4' />
                    </Button>
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
                            setQty(item.id, getQty(item.id, item.quantity) - 1)
                          }
                          disabled={
                            getQty(item.id, item.quantity) <= MIN_QTY ||
                            updateQty.isPending
                          }
                          className='rounded-r-none rounded-l-md size-8'
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <Minus className='size-4' />
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
                              setQty(item.id, Math.floor(v))
                            }
                          }}
                          onBlur={() => handleQtyBlur(item.id, item.quantity)}
                          className='w-16 h-8 text-center border-x-0 [appearance:textfield] rounded-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        />
                        <Button
                          type='button'
                          size='icon'
                          variant='outline'
                          onClick={() =>
                            setQty(item.id, getQty(item.id, item.quantity) + 1)
                          }
                          disabled={
                            getQty(item.id, item.quantity) >= MAX_QTY ||
                            updateQty.isPending
                          }
                          className='rounded-l-none rounded-r-md size-8'
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          <Plus className='size-4' />
                        </Button>
                      </div>
                    </div>
                    <span className='font-medium text-green-700 dark:text-green-400'>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.price * getQty(item.id, item.quantity))}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(item.price)}{' '}
                    each
                  </p>
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
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(subtotal)}
              </span>
            </div>
            <Button
              size='lg'
              className='w-full bg-green-700 hover:bg-green-800'
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
