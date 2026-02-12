'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className='relative overflow-hidden px-4'>
      <div className='absolute inset-0 bg-linear-to-br from-secondary to-background -z-10' />

      <div className='max-w-6xl mx-auto py-12 sm:py-20 md:py-32'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          {/* Left Content */}
          <div className='space-y-4 md:space-y-8'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight'>
              Advanced Peptide Solutions
            </h1>

            <p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg'>
              Delivering cutting-edge products and inovations, processed
              domestically in the USA.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Link href='/shop'>
                <Button
                  size='lg'
                  className='bg-green-700 text-white hover:bg-green-800 gap-2'
                >
                  Go to Shop <ArrowRight className='size-4' />
                </Button>
              </Link>
              <Link href='/faq'>
                <Button size='lg' variant='outline'>
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className='relative'>
            <div className='aspect-square rounded-2xl overflow-hidden shadow-lg'>
              <Image
                src='https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/general/hero-image.webp'
                alt='Hero Image'
                fill
                className='object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
