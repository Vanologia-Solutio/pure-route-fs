'use client'

import CartSheet from '@/components/cart/cart-sheet'
import { cartQueries } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/shared/stores/auth-store'
import {
  BadgeHelp,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export default function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [cartSheetOpen, setCartSheetOpen] = useState(false)

  const { user, isAuthenticated, signOut } = useAuthStore()
  const role = user?.attrs?.role?.toLowerCase() ?? ''
  const { data: cartDetails, isLoading: isCartLoading } =
    cartQueries.useGetDetails(role)

  const navigationItems = [
    { label: 'Shop', href: '/shop', icon: <Store className='size-5' /> },
    {
      label: 'Support',
      href: '/support',
      icon: <MessageCircle className='size-5' />,
    },
    { label: 'FAQ', href: '/faq', icon: <BadgeHelp className='size-5' /> },
  ]

  const handleLogout = () => {
    signOut()
    router.replace('/login')
  }

  const isAdmin = role === 'administrator'

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
        {isAuthenticated ? (
          <div className='flex items-center gap-4'>
            {!isAdmin && (
              <>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-base font-medium hover:text-green-700 hover:scale-105 duration-250 transition-all relative'
                  disabled={isCartLoading}
                  onClick={() => setCartSheetOpen(true)}
                >
                  <span className='relative flex items-center'>
                    <ShoppingCart className='size-5' />
                    {!isCartLoading && (
                      <span className='absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 rounded-full text-xs font-medium bg-green-700 text-white aspect-square w-fit min-w-4.5 h-4.5'>
                        {cartDetails?.data?.products?.length ?? 0}
                      </span>
                    )}
                  </span>
                </Button>
                <CartSheet
                  open={cartSheetOpen}
                  onOpenChange={setCartSheetOpen}
                  role={role}
                />
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='text-base font-medium hover:text-green-700 duration-250 transition-all'
                >
                  <User className='size-5' />
                  {user?.name.split(' ')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isAdmin && (
                  <DropdownMenuItem>
                    <LayoutDashboard className='size-4' />
                    Go to Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className='size-4' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            variant='ghost'
            className='text-base font-medium hover:text-green-700 hover:scale-105 duration-250 transition-all'
            onClick={() => router.push('/login')}
          >
            <User className='size-5' />
            Login
          </Button>
        )}
      </div>
    </nav>
  )
}
