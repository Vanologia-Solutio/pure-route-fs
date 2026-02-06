'use client'

import CheckoutForm from '@/components/checkout/checkout-form'
import OrderSummary from '@/components/checkout/order-summary'
import { cartQueries } from '@/hooks/use-cart'
import { Fragment, useState } from 'react'

export default function CheckoutPage() {
  const [shipment, setShipment] = useState('standard')
  const [payment, setPayment] = useState('card')

  const { data: cartRes, isLoading: isLoadingCart } =
    cartQueries.useGetDetails()
  const items = cartRes?.data?.products ?? []

  const subtotal =
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0
  const shipmentCost = shipment === 'express' ? 15 : 5
  const total = subtotal + shipmentCost

  return (
    <Fragment>
      <div className='mb-6 lg:hidden'>
        <OrderSummary
          items={items}
          subtotal={subtotal}
          shipmentCost={shipmentCost}
          total={total}
          mobile
          states={{ isLoading: isLoadingCart }}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <CheckoutForm
            shipment={shipment}
            setShipment={setShipment}
            payment={payment}
            setPayment={setPayment}
          />
        </div>

        <div className='hidden lg:block'>
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipmentCost={shipmentCost}
            total={total}
            states={{ isLoading: isLoadingCart }}
          />
        </div>
      </div>
    </Fragment>
  )
}
