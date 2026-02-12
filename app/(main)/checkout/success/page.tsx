import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { CheckCircle, FileText, Store } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className='flex items-center justify-center min-h-[80vh] p-4 lg:px-0 lg:py-4'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <CheckCircle className='size-16 text-green-700' />
          </EmptyMedia>
          <EmptyTitle className='text-2xl font-bold'>
            Thank you for your order
          </EmptyTitle>
          <EmptyDescription className='text-base'>
            Your order has been placed! We&apos;ve sent instructions to your
            email to complete your order and payment. Please check your inbox
            for further details on how to proceed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex sm:flex-row flex-col gap-2 justify-center items-center'>
            <Link href='/shop'>
              <Button className='bg-green-700 text-white hover:bg-green-800'>
                <Store className='size-4' />
                Continue shopping
              </Button>
            </Link>
            <Link href='/orders'>
              <Button className='bg-green-700 text-white hover:bg-green-800'>
                <FileText className='size-4' />
                View orders
              </Button>
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
