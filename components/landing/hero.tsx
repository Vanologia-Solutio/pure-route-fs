'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()

  const handleGoToShop = () => {
    router.push('/shop')
  }

  const handleLearnMore = () => {
    router.push('/faq')
  }

  return (
    <section className='relative overflow-hidden px-4'>
      <div className='absolute inset-0 bg-linear-to-br from-secondary to-background -z-10' />

      <div className='max-w-6xl mx-auto py-20 md:py-32'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          {/* Left Content */}
          <div className='space-y-8'>
            <Badge variant='secondary' className='w-fit'>
              ✨ Innovation in Healthcare
            </Badge>

            <h1 className='text-5xl md:text-6xl font-bold text-foreground leading-tight'>
              Advanced Pharmaceutical Solutions
            </h1>

            <p className='text-xl text-muted-foreground max-w-lg'>
              Delivering cutting-edge pharmaceutical products and healthcare
              innovations to improve patient outcomes and advance medical
              science.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Button
                size='lg'
                className='bg-green-700 text-white hover:bg-green-800 gap-2'
                onClick={handleGoToShop}
              >
                Go to Shop <ArrowRight className='size-4' />
              </Button>
              <Button size='lg' variant='outline' onClick={handleLearnMore}>
                Learn More
              </Button>
            </div>

            <div className='flex items-center gap-8 pt-8 border-t border-border'>
              <div>
                <div className='text-2xl font-bold text-green-700'>0+</div>
                <p className='text-sm text-muted-foreground'>
                  Healthcare Partners
                </p>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-700'>0+</div>
                <p className='text-sm text-muted-foreground'>Patients Helped</p>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-700'>0+</div>
                <p className='text-sm text-muted-foreground'>
                  Years in Industry
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className='relative'>
            <div className='aspect-square bg-linear-to-br from-green-700/20 to-accent/20 rounded-2xl overflow-hidden flex items-center justify-center'>
              <div className='text-center space-y-4'>
                <div className='size-24 bg-green-700/10 rounded-full mx-auto flex items-center justify-center'>
                  <CheckCircle className='size-12 text-green-700' />
                </div>
                <p className='text-primary font-semibold'>FDA Approved</p>
                <p className='text-muted-foreground text-sm'>
                  Certified & Trusted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
