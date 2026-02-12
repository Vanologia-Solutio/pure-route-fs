'use client'

import LoadingSpinner from '@/components/general/loader-spinner'
import AddToCart from '@/components/products/add-to-cart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Separator } from '@/components/ui/separator'
import { productQueries } from '@/hooks/use-products'
import { Role } from '@/shared/enums/role'
import { useAuthStore } from '@/shared/stores/auth-store'
import { formatCurrency } from '@/shared/utils/formatter'
import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  CircleQuestionMark,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const { data, isLoading } = productQueries.useGetById(id as string)

  if (isLoading) {
    return <LoadingSpinner message='Loading product details...' />
  }

  if (!data?.data) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <CircleQuestionMark />
          </EmptyMedia>
          <EmptyTitle>Product not found</EmptyTitle>
          <EmptyDescription>
            The product you are looking for does not exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className='flex-row justify-center gap-2'>
          <Link href='/shop'>
            <Button className='bg-green-700 text-white hover:bg-green-800'>
              <ChevronLeft className='size-4' />
              Back to shop
            </Button>
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  const { data: product } = data
  const isAdmin = user?.attrs?.role?.toLowerCase() === Role.ADMINISTRATOR

  return (
    <article className='mx-auto w-full space-y-6'>
      <Link
        href='/shop'
        className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group'
      >
        <ArrowLeft className='size-4' />
        Back to shop
      </Link>

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
              {formatCurrency(product?.price ?? 0)}
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
          <Separator className='mb-4 md:mb-8' />
          {!isAdmin && <AddToCart product={product} />}
        </div>
      </div>
    </article>
  )
}
