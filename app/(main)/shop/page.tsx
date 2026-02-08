'use client'

import LoadingSpinner from '@/components/general/loader-spinner'
import ProductDisplay from '@/components/products/product-display'
import { Separator } from '@/components/ui/separator'
import { productQueries } from '@/hooks/use-products'
import { Fragment } from 'react'

export default function ShopPage() {
  const { data, isLoading } = productQueries.useList()

  return (
    <Fragment>
      <h1 className='text-2xl font-bold mb-2 md:text-3xl'>
        Research Compounds
      </h1>
      <p className='text-sm md:text-base text-muted-foreground'>
        All products are processed in the United States of America.
      </p>
      <Separator className='my-4 md:my-6' />
      {isLoading ? (
        <LoadingSpinner message='Loading products...' />
      ) : (
        <ProductDisplay products={data?.data || []} />
      )}
    </Fragment>
  )
}
