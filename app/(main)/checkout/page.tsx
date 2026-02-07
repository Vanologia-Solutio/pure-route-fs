'use client'

import CheckoutForm from '@/components/checkout/checkout-form'
import OrderSummary from '@/components/checkout/order-summary'
import { cartQueries } from '@/hooks/use-cart'
import { masterDataQueries } from '@/hooks/use-master-data'
import { CHECKOUT_LOV } from '@/shared/constants/checkout-lov'
import { Fragment, SubmitEvent, useState } from 'react'

export default function CheckoutPage() {
  const [shipmentMethod, setShipmentMethod] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const { data: cartRes, isLoading: isLoadingCart } =
    cartQueries.useGetDetails()
  const items = cartRes?.data?.products ?? []
  const { data: shipmentMethodsRes, isLoading: isLoadingShipmentMethods } =
    masterDataQueries.useGetShipmentMethods()
  const shipmentMethods = shipmentMethodsRes?.data ?? []

  const subtotal =
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0
  const shipmentCost = shipmentMethods.find(m => m.id === shipmentMethod)?.price ?? 0
  const total = subtotal + shipmentCost

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const orderSubmission = {
      ...Object.fromEntries(formData.entries()),
      shipmentMethod,
      paymentMethod,
    }
    console.log(orderSubmission)
  }

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
            shipmentMethods={shipmentMethods}
            shipmentMethod={shipmentMethod}
            setShipmentMethod={setShipmentMethod}
            paymentMethods={CHECKOUT_LOV.PAYMENT_METHODS}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onSubmit={handleSubmit}
            states={{ isLoading: isLoadingCart || isLoadingShipmentMethods }}
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
