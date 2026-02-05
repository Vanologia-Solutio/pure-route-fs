'use client'

import { cn } from '@/lib/utils'
import { BadgeHelp, MessageCircle, ShoppingCart, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../ui/button'

export default function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    { label: 'Shop', href: '/shop', icon: <Store className='size-5' /> },
    {
      label: 'Support',
      href: '/support',
      icon: <MessageCircle className='size-5' />,
    },
    { label: 'FAQ', href: '/faq', icon: <BadgeHelp className='size-5' /> },
  ]

  return (
    <nav className='sticky top-0 z-50 w-full bg-white shadow-md p-4'>
      <div className='max-w-6xl mx-auto flex items-center justify-between gap-4'>
        <Link href='/'>
          <Image src='/logo.png' alt='Logo' width={196} height={36} />
        </Link>
        <div className='flex items-center gap-4'>
          {navigationItems.map(item => (
            <Button
              key={item.href}
              variant='ghost'
              className={cn(
                'text-base font-medium hover:text-green-700 hover:scale-105 duration-250 transition-all',
                pathname === item.href && 'text-green-700',
              )}
              onClick={() => router.push(item.href)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
        <div className='relative'>
          <Button
            variant='ghost'
            className='text-base font-medium hover:text-green-700 hover:scale-105 duration-250 transition-all relative'
          >
            <span className='relative flex items-center'>
              <ShoppingCart className='size-5' />
              <span
                className='absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 rounded-full text-xs font-medium bg-green-700 text-white aspect-square'
                style={{ minWidth: 18, height: 18 }}
              >
                3
              </span>
            </span>
            <span className='ml-1'>Cart</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
