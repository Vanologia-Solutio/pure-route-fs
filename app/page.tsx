import CTA from '@/components/landing/cta'
import Features from '@/components/landing/features'
import Hero from '@/components/landing/hero'
import { Fragment } from 'react'

export default function Home() {
  return (
    <Fragment>
      <Hero />
      <Features />
      <CTA />
    </Fragment>
  )
}
