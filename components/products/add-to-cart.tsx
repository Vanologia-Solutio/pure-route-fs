'use client'

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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cartQueries } from '@/hooks/use-cart'
import { useAuthStore } from '@/shared/stores/auth-store'
import { Product } from '@/shared/types/product'
import { Info, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'

const MIN_QTY = 1
const MAX_QTY = 99

export default function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(MIN_QTY)
  const [loginOpen, setLoginOpen] = useState(false)
  const addItem = cartQueries.useAddItem()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber
    if (Number.isNaN(value) || value < MIN_QTY) setQuantity(MIN_QTY)
    else if (value > MAX_QTY) setQuantity(MAX_QTY)
    else setQuantity(Math.floor(value))
  }

  const handleDecrease = () => {
    setQuantity(prev => (prev > MIN_QTY ? prev - 1 : MIN_QTY))
  }

  const handleIncrease = () => {
    setQuantity(prev => (prev < MAX_QTY ? prev + 1 : MAX_QTY))
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setLoginOpen(true)
      return
    }

    addItem.mutate({
      productId: String(product.id),
      quantity,
    })
  }

  const handleGoToLogin = () => {
    setLoginOpen(false)
    router.push('/login')
  }

  return (
    <Fragment>
      <div className='w-full max-w-xs bg-white rounded-xl shadow-md border border-gray-200 p-4 flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <p className='font-medium text-gray-500'>Quantity</p>
          <div className='flex items-center'>
            <Button
              type='button'
              size='icon'
              variant='outline'
              onClick={handleDecrease}
              disabled={quantity <= MIN_QTY || addItem.isPending}
              className='rounded-r-none rounded-l-md size-10'
              aria-label='Decrease quantity'
            >
              <Minus className='size-4' />
            </Button>
            <Input
              id='quantity'
              type='number'
              min={MIN_QTY}
              max={MAX_QTY}
              value={quantity}
              onChange={handleChange}
              disabled={addItem.isPending}
              className='w-20 h-10 text-center border-x-0 [appearance:textfield] rounded-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            />
            <Button
              type='button'
              size='icon'
              variant='outline'
              onClick={handleIncrease}
              disabled={quantity >= MAX_QTY || addItem.isPending}
              className='rounded-l-none rounded-r-md size-10'
              aria-label='Increase quantity'
            >
              <Plus className='size-4' />
            </Button>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          className='bg-green-700 text-white hover:bg-green-800 w-full flex items-center justify-center gap-2'
          size='lg'
          disabled={addItem.isPending}
        >
          <ShoppingCart className='size-4' />
          {addItem.isPending ? 'Adding...' : 'Add to Cart - '}
          {!addItem.isPending &&
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(product.price * quantity)}
        </Button>
      </div>

      <AlertDialog open={loginOpen} onOpenChange={setLoginOpen}>
        <AlertDialogContent size='sm'>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Info />
            </AlertDialogMedia>
            <AlertDialogTitle>Login required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to add items to your cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay here</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button className='bg-green-700 text-white hover:bg-green-800' onClick={handleGoToLogin}>
                Go to login
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  )
}
