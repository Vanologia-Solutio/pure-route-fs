import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { products } from '@/shared/constants/products'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Fragment } from 'react'

export default function ShopPage() {
  return (
    <Fragment>
      <h1 className='text-3xl font-bold mb-2'>Research Compounds</h1>
      <p className='text-gray-500'>
        All products are processed in the United States of America.
      </p>
      <Separator className='my-4 md:my-6' />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
        {products.map(product => (
          <Card key={product.id} className='relative pt-0 overflow-hidden hover:shadow-xl transition-all duration-200'>
            <div className='relative aspect-square w-full h-full'>
              <Image src={product.imgUrl} alt={product.name} fill sizes='width: 100%; height: 100%;' />
            </div>
            <CardHeader className='space-y-1'>
              <Badge className='bg-blue-500/10 text-blue-800'>{product.category.toUpperCase()}</Badge>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className='flex items-center justify-between w-full'>
                <span className='text-xl font-bold text-green-700'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</span>
                <Button className='bg-green-700 text-white hover:bg-green-800'>
                  <ShoppingCart className='size-4 ' />
                  Add to Cart
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Fragment>
  )
}
