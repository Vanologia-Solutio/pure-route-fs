'use client'

import AddToCart from '@/components/products/add-to-cart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { productQueries } from '@/hooks/use-products'
import { CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

export default function ProductPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data, isLoading } = productQueries.useGetById(id as string)

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 p-12'>
        <Loader2 className='size-16 animate-spin' />
        <p className='text-xl font-medium text-gray-500'>Loading product...</p>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 p-12'>
        <p className='text-xl font-medium text-gray-500'>Product not found</p>
        <Button onClick={() => router.replace('/shop')}>Back to shop</Button>
      </div>
    )
  }

  const { data: product } = data

  return (
    <article className='w-full max-w-6xl mx-auto py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start'>
        <div className='relative aspect-square w-full min-h-[280px] md:min-h-0 rounded-xl overflow-hidden bg-muted shadow-lg'>
          <Image
            src={product?.file_path}
            alt={product?.name}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover'
            priority
          />
          <Badge className='absolute top-4 left-4 bg-green-700 text-white'>
            Research Grade
          </Badge>
        </div>
        <div className='flex flex-col justify-center space-y-4 md:space-y-6'>
          <Badge className='w-fit bg-blue-500/10 text-blue-800 dark:text-blue-200'>
            {product?.category.toUpperCase()}
          </Badge>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
            {product?.name}
          </h1>
          <div className='flex items-end gap-1.5'>
            <p className='text-3xl font-bold text-green-700 dark:text-green-400'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(product?.price)}
            </p>
            <p className='text-gray-500'>/ {product?.category}</p>
          </div>
          <p className='text-muted-foreground leading-relaxed'>
            {product?.description}
          </p>
          <ul className='space-y-2'>
            {[
              'High purity (>99%) laboratory grade',
              'Lyophilized powder for stability',
              'Third-party tested and verified',
              'Ships in temperature-controlled packaging',
            ].map(feature => (
              <li
                key={feature}
                className='text-muted-foreground leading-relaxed flex items-center gap-2'
              >
                <CheckCircle className='size-4 text-green-700' />
                {feature}
              </li>
            ))}
          </ul>
          <Separator className='mb-8' />
          <AddToCart product={product} />
        </div>
      </div>
    </article>
  )
}
