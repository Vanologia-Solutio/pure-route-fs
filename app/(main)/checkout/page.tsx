'use client'

import CheckoutForm from '@/components/orders/checkout-form'
import OrderSummary from '@/components/orders/order-summary'
import { cartQueries } from '@/hooks/use-cart'
import { masterDataQueries } from '@/hooks/use-master-data'
import { orderQueries } from '@/hooks/use-order'
import { CHECKOUT_LOV } from '@/shared/constants/checkout-lov'
import { CreateOrderDto } from '@/shared/dtos/order'
import { useRouter } from 'next/navigation'
import { Fragment, SubmitEvent, useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()

  const [shipmentMethod, setShipmentMethod] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const { data: cartRes, isLoading: isLoadingCart } =
    cartQueries.useGetDetails()
  const items = cartRes?.data?.products ?? []
  const { data: shipmentMethodsRes, isLoading: isLoadingShipmentMethods } =
    masterDataQueries.useGetShipmentMethods()
  const shipmentMethods = shipmentMethodsRes?.data ?? []
  const { mutateAsync: createOrder, isPending: isLoadingCreateOrder } =
    orderQueries.useCreate()

  const subtotal =
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0
  const shipmentCost =
    shipmentMethods.find(m => m.id === shipmentMethod)?.fee ?? 0
  const total = subtotal + shipmentCost

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const orderSubmission = {
      ...Object.fromEntries(formData.entries()),
      shipmentMethod,
      paymentMethod,
    } as CreateOrderDto

    try {
      const res = await createOrder(orderSubmission)
      if (res.success) {
        router.push(`/orders/${res.data?.id}`)
      }
    } catch (error) {
      console.error(error)
    }
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
            states={{
              isCartLoading: isLoadingCart,
              isShipmentMethodsLoading: isLoadingShipmentMethods,
              isCreateOrderLoading: isLoadingCreateOrder,
            }}
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
