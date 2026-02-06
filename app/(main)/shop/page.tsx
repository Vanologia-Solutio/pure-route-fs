'use client'

import ProductDisplay from '@/components/products/product-display'
import { Separator } from '@/components/ui/separator'
import { productQueries } from '@/hooks/use-products'
import { Loader2 } from 'lucide-react'
import { Fragment } from 'react'

export default function ShopPage() {
  const { data, isLoading } = productQueries.useList()

  return (
    <Fragment>
      <h1 className='text-3xl font-bold mb-2'>Research Compounds</h1>
      <p className='text-gray-500'>
        All products are processed in the United States of America.
      </p>
      <Separator className='my-4 md:my-6' />
      {isLoading ? (
        <div className='flex flex-col items-center justify-center gap-4 p-12'>
          <Loader2 className='size-16 animate-spin' />
          <p className='text-xl font-medium text-gray-500'>
            Loading products...
          </p>
        </div>
      ) : (
        <ProductDisplay products={data?.data || []} />
      )}
    </Fragment>
  )
}
