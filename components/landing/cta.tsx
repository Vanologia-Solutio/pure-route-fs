'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CTA() {
  const router = useRouter()

  const handleGoToShop = () => {
    router.push('/shop')
  }

  const handleContactSupport = () => {
    router.push('/support')
  }

  return (
    <section className='py-20 md:py-32 bg-linear-to-br from-blue-800 via-green-900 to-green-700'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
          Shop Premium Peptide Compounds Today
        </h2>

        <p className='text-base sm:text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto'>
          Discover Pure Route Peptides, your trusted source for high-purity
          peptide-based compounds. Browse our selection and order directly for
          fast, reliable delivery straight to your facility.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            size='lg'
            className='bg-white text-green-700 hover:bg-white/90 gap-2'
            onClick={handleGoToShop}
          >
            Shop Compounds <ArrowRight className='size-4' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='border-white text-white hover:bg-white/10 bg-transparent hover:text-white'
            onClick={handleContactSupport}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  )
}
