'use client'

import CartSheet from '@/components/cart/cart-sheet'
import { cartQueries } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import { Role } from '@/shared/enums/role'
import { useAuthStore } from '@/shared/stores/auth-store'
import {
  BadgeHelp,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  ScrollText,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'

export default function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [cartSheetOpen, setCartSheetOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { user, isAuthenticated, signOut } = useAuthStore()
  const { data: cartDetails, isLoading: isCartLoading } =
    cartQueries.useGetDetails()

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
    setMobileMenuOpen(false)
    router.replace('/login')
  }

  const navigateAndClose = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
  }

  const isAdmin = user?.attrs?.role?.toLowerCase() === Role.ADMINISTRATOR

  const navButtonClass = (href: string) =>
    cn(
      'text-base font-medium hover:text-green-700 duration-200 transition-all',
      pathname === href && 'text-green-700',
    )

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm'>
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6'>
        <Link href='/' className='shrink-0'>
          <Image
            src='/logo.webp'
            alt='Logo'
            width={196}
            height={36}
            className='h-8 w-auto sm:h-9'
          />
        </Link>

        {/* Desktop: nav links */}
        <div className='hidden items-center gap-1 md:flex'>
          {navigationItems.map(item => (
            <Button
              key={item.href}
              variant='ghost'
              className={navButtonClass(item.href)}
              onClick={() => router.push(item.href)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>

        {/* Right: cart, user, or login — desktop and mobile */}
        <div className='flex items-center gap-1 sm:gap-2'>
          {isAuthenticated && !isAdmin && (
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'relative shrink-0 text-foreground hover:text-green-700',
                'md:size-9',
              )}
              disabled={isCartLoading}
              onClick={() => setCartSheetOpen(true)}
              aria-label='Open cart'
            >
              <ShoppingCart className='size-5' />
              {!isCartLoading && (
                <span className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-medium text-white'>
                  {cartDetails?.data?.products?.length ?? 0}
                </span>
              )}
            </Button>
          )}

          {/* Desktop: user dropdown or login */}
          <div className='hidden md:block'>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='text-base font-medium hover:text-green-700'
                  >
                    <User className='size-5' />
                    {user?.name?.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {isAdmin ? (
                    <DropdownMenuItem
                      onClick={() => router.push('/admin/panel')}
                    >
                      <LayoutDashboard className='size-4' />
                      Admin Panel
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => router.push('/orders')}>
                      <ScrollText className='size-4' />
                      Orders
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className='size-4' />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant='ghost'
                className='text-base font-medium hover:text-green-700'
                onClick={() => router.push('/login')}
              >
                <User className='size-5' />
                Login
              </Button>
            )}
          </div>

          {/* Mobile: hamburger opens menu sheet */}
          <Button
            variant='ghost'
            size='icon'
            className='shrink-0 md:hidden'
            onClick={() => setMobileMenuOpen(true)}
            aria-label='Open menu'
          >
            <Menu className='size-6' />
          </Button>
        </div>
      </div>

      <CartSheet open={cartSheetOpen} onOpenChange={setCartSheetOpen} />

      {/* Mobile menu sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side='right' className='w-[280px] sm:max-w-sm'>
          <SheetHeader>
            <SheetTitle className='sr-only'>Menu</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-1 px-2 pb-6'>
            {navigationItems.map(item => (
              <Button
                key={item.href}
                variant='ghost'
                className={cn(
                  'justify-start gap-3 text-left font-medium',
                  pathname === item.href && 'bg-green-700/10 text-green-700',
                )}
                onClick={() => navigateAndClose(item.href)}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
            <div className='my-2 border-t border-slate-200' />
            {isAuthenticated ? (
              <Fragment>
                {isAdmin ? (
                  <Button
                    variant='ghost'
                    className='justify-start gap-3 text-left font-medium'
                    onClick={() => navigateAndClose('/admin/panel')}
                  >
                    <LayoutDashboard className='size-5' />
                    Admin Panel
                  </Button>
                ) : (
                  <Button
                    variant='ghost'
                    className='justify-start gap-3 text-left font-medium'
                    onClick={() => navigateAndClose('/orders')}
                  >
                    <ScrollText className='size-5' />
                    Orders
                  </Button>
                )}
                <Button
                  variant='ghost'
                  className='justify-start gap-3 text-left font-medium text-red-600 hover:text-red-700'
                  onClick={handleLogout}
                >
                  <LogOut className='size-5' />
                  Logout
                </Button>
              </Fragment>
            ) : (
              <Button
                variant='ghost'
                className='justify-start gap-3 text-left font-medium hover:text-green-700'
                onClick={() => navigateAndClose('/login')}
              >
                <User className='size-5' />
                Login
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
