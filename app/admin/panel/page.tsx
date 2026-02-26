'use client'

import OrdersTab from '@/components/admin/orders-tab'
import PromotionsTab from '@/components/admin/promotions-tab'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Package, Percent, ScrollText, Users } from 'lucide-react'
import { Fragment, useState } from 'react'

const TAB_MENU_ITEMS = [
  {
    label: 'Orders',
    value: 'orders',
    icon: <ScrollText className='size-4' />,
    component: <OrdersTab />,
  },
  {
    label: 'Promotions',
    value: 'promotions',
    icon: <Percent className='size-4' />,
    component: <PromotionsTab />,
  },
  {
    label: 'Users',
    value: 'users',
    icon: <Users className='size-4' />,
    component: (
      <div className='mt-6'>
        <p className='text-muted-foreground'>Users management coming soon.</p>
      </div>
    ),
  },
  {
    label: 'Products & Inventory',
    value: 'products',
    icon: <Package className='size-4' />,
    component: (
      <div className='mt-6'>
        <p className='text-muted-foreground'>
          Products & inventory management coming soon.
        </p>
      </div>
    ),
  },
]

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<string>(TAB_MENU_ITEMS[0].value)

  return (
    <Fragment>
      <h1 className='mb-2 text-2xl font-bold md:text-3xl'>Admin Panel</h1>
      <p className='text-muted-foreground'>
        Welcome to the admin panel. Here you can manage the website and the
        orders.
      </p>
      <Separator className='my-4 md:my-6' />
      {/* Custom Responsive Tabs with shadcn small buttons */}
      <div className='w-full'>
        <div
          className={cn(
            'flex w-full rounded-lg bg-muted p-1.5 mb-4 sm:mb-6 gap-1.5',
            TAB_MENU_ITEMS.length > 2 && 'overflow-x-auto',
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {TAB_MENU_ITEMS.map(item => (
            <Button
              key={item.value}
              variant={activeTab === item.value ? 'default' : 'ghost'}
              size='sm'
              className={cn(
                'hover:bg-green-700/10 hover:text-green-700 focus:bg-green-700 focus:text-white',
                activeTab === item.value && 'bg-green-700 text-white shadow-sm',
              )}
              onClick={() => setActiveTab(item.value)}
              disabled={item.component === undefined}
              aria-current={activeTab === item.value ? 'page' : undefined}
              type='button'
            >
              <span className='mr-1'>{item.icon}</span>
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
        <div>
          {TAB_MENU_ITEMS.find(item => item.value === activeTab)?.component}
        </div>
      </div>
    </Fragment>
  )
}
