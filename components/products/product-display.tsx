'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cartQueries } from '@/hooks/use-cart'
import { Role } from '@/shared/enums/role'
import { useAuthStore } from '@/shared/stores/auth-store'
import { Product } from '@/shared/types/product'
import { formatCurrency } from '@/shared/utils/formatter'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Fragment, MouseEvent, useState } from 'react'
import LoginAlert from '../general/login-alert'

export default function ProductDisplay({ products }: { products: Product[] }) {
  const router = useRouter()
  const addItem = cartQueries.useAddItem()
  const { user, isAuthenticated } = useAuthStore()
  const [addingId, setAddingId] = useState<number | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)

  const handleProductClick = (id: number) => {
    router.push(`/shop/products/${id}`)
  }

  const handleAddOneToCart = (
    e: MouseEvent<HTMLButtonElement>,
    productId: number,
  ) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      setLoginOpen(true)
      return
    }

    setAddingId(productId)
    addItem.mutate(
      { productId: String(productId), quantity: 1 },
      { onSettled: () => setAddingId(null) },
    )
  }

  const isAdmin = user?.attrs?.role?.toLowerCase() === Role.ADMINISTRATOR
  const isAnyAdding = addItem.isPending

  return (
    <Fragment>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6'>
        {products.map(product => (
          <Card
            key={product.id}
            className='relative pt-0 sm:pt-0 overflow-hidden hover:shadow-xl transition-all duration-200'
          >
            <div
              className='relative aspect-square w-full h-full cursor-pointer'
              onClick={() => handleProductClick(product.id)}
            >
              <Image
                src={product.file_path}
                alt={product.name}
                fill
                sizes='width: 100%; height: 100%;'
              />
            </div>
            <CardHeader className='space-y-0.5 sm:space-y-1'>
              <Badge className='bg-blue-500/10 text-blue-800 text-[0.625rem] sm:text-sm'>
                {product.category.toUpperCase()}
              </Badge>
              <CardTitle className='text-sm sm:text-base line-clamp-1'>
                {product.name}
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm line-clamp-2'>
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className='flex flex-row gap-2 items-center justify-between w-full'>
                <span className='text-lg sm:text-xl font-bold text-green-700'>
                  {formatCurrency(product.price)}
                </span>
                {!isAdmin && (
                  <Button
                    size='sm'
                    className='bg-green-700 text-white hover:bg-green-800'
                    type='button'
                    disabled={isAnyAdding}
                    onClick={e => handleAddOneToCart(e, product.id)}
                  >
                    <ShoppingCart className='size-4 block md:hidden' />
                    <span className='hidden md:block'>
                      {addingId === product.id && isAnyAdding
                        ? 'Adding...'
                        : 'Add to Cart'}
                    </span>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <LoginAlert loginOpen={loginOpen} setLoginOpen={setLoginOpen} />
    </Fragment>
  )
}
