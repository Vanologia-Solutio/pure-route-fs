'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CHECKOUT_LOV } from '@/shared/constants/checkout-lov'
import { useAuthStore } from '@/shared/stores/auth-store'
import { PaymentMethod, ShipmentMethod } from '@/shared/types/master-data'
import { formatCurrency } from '@/shared/utils/formatter'
import { Loader2, PackageCheck } from 'lucide-react'
import { Dispatch, SetStateAction, SubmitEvent } from 'react'
import { Skeleton } from '../ui/skeleton'

interface CheckoutFormProps {
  shipmentMethods: ShipmentMethod[]
  shipmentMethod: string
  setShipmentMethod: Dispatch<SetStateAction<string>>
  paymentMethods: PaymentMethod[]
  paymentMethod: string
  setPaymentMethod: Dispatch<SetStateAction<string>>
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void
  states: {
    isCartLoading: boolean
    isPaymentMethodsLoading: boolean
    isShipmentMethodsLoading: boolean
    isCreateOrderLoading: boolean
  }
}

export default function CheckoutForm({
  shipmentMethods,
  shipmentMethod,
  setShipmentMethod,
  paymentMethods,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  states,
}: CheckoutFormProps) {
  const { user } = useAuthStore()

  const isGlobalDisabled =
    states.isCartLoading ||
    states.isPaymentMethodsLoading ||
    states.isShipmentMethodsLoading ||
    states.isCreateOrderLoading

  return (
    <form onSubmit={onSubmit} className='space-y-4 sm:space-y-6'>
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base sm:text-lg'>
            Contact Information
          </CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            We&apos;ll use this email to send you details and updates about your
            order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Email Address'
                defaultValue={user?.email ?? ''}
                disabled={isGlobalDisabled}
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base sm:text-lg'>
            Shipping Address
          </CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Enter the address where you want your order delivered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='gap-4'>
            <Field>
              <Input
                id='recipientName'
                name='recipientName'
                placeholder='Recipient Name'
                defaultValue={user?.name ?? ''}
                disabled={isGlobalDisabled}
                required
              />
            </Field>
            <Field>
              <Select name='country' disabled={isGlobalDisabled} required>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Country or Region' />
                </SelectTrigger>
                <SelectContent position='popper'>
                  <SelectGroup>
                    <SelectLabel>Country or Region</SelectLabel>
                    {CHECKOUT_LOV.COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Textarea
                id='address'
                name='address'
                placeholder='Address'
                rows={3}
                defaultValue=''
                disabled={isGlobalDisabled}
                required
              />
            </Field>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Field>
                <Input
                  id='city'
                  name='city'
                  placeholder='City'
                  defaultValue=''
                  disabled={isGlobalDisabled}
                  required
                />
              </Field>
              <Field>
                <Select name='state' disabled={isGlobalDisabled} required>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='State or County' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectGroup>
                      <SelectLabel>State or County</SelectLabel>
                      {CHECKOUT_LOV.STATES.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Field>
                <Input
                  id='postalCode'
                  name='postalCode'
                  placeholder='Postal Code'
                  maxLength={5}
                  defaultValue=''
                  disabled={isGlobalDisabled}
                  required
                />
              </Field>
              <Field>
                <Input
                  id='phone'
                  name='phone'
                  placeholder='Phone (optional)'
                  defaultValue=''
                  disabled={isGlobalDisabled}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Shipment Method */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base sm:text-lg'>
            Shipment Options
          </CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Choose your preferred delivery speed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            name='checkout-shipment-method'
            value={shipmentMethod ? `shipment-${shipmentMethod}` : ''}
            onValueChange={v =>
              setShipmentMethod(v ? v.replace(/^shipment-/, '') : '')
            }
            disabled={isGlobalDisabled}
            required
          >
            {states.isShipmentMethodsLoading ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='w-full h-10' />
                <Skeleton className='w-full h-10' />
                <Skeleton className='w-full h-10' />
              </div>
            ) : (
              shipmentMethods.map(s => (
                <FieldLabel key={s.id} htmlFor={`shipment-${s.id}`}>
                  <Field orientation='horizontal'>
                    <FieldContent>
                      <FieldTitle>
                        {s.code} ({formatCurrency(s.fee)})
                      </FieldTitle>
                      <FieldDescription>{s.description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value={`shipment-${s.id}`}
                      id={`shipment-${s.id}`}
                    />
                  </Field>
                </FieldLabel>
              ))
            )}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base sm:text-lg'>Payment Method</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Select how you would like to pay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            name='checkout-payment-method'
            value={paymentMethod ? `payment-${paymentMethod}` : ''}
            onValueChange={v =>
              setPaymentMethod(v ? v.replace(/^payment-/, '') : '')
            }
            disabled={isGlobalDisabled}
            required
          >
            {states.isPaymentMethodsLoading ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='w-full h-10' />
                <Skeleton className='w-full h-10' />
                <Skeleton className='w-full h-10' />
              </div>
            ) : (
              paymentMethods.map(p => (
                <FieldLabel key={p.id} htmlFor={`payment-${p.id}`}>
                  <Field orientation='horizontal'>
                    <FieldContent>
                      <FieldTitle>{p.name}</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value={`payment-${p.id}`}
                      id={`payment-${p.id}`}
                    />
                  </Field>
                </FieldLabel>
              ))
            )}
          </RadioGroup>
          <p className='text-xs text-muted-foreground mt-4'>
            <span className='text-green-700'>Important:</span> Upon selecting{' '}
            <strong>Zelle, Cash App, or Venmo</strong>, you&apos;ll receive a
            secure email with our official payment details after checkout. For
            security, payment info is not displayed on the site. All orders are
            time-sensitive and must be completed promptly to avoid cancellation.
            Thank you for your understanding.
          </p>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type='submit'
        size='lg'
        className='w-full bg-green-700 text-white hover:bg-green-800'
        disabled={isGlobalDisabled}
      >
        {states.isCreateOrderLoading ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <PackageCheck className='size-4' />
        )}
        Place Order
      </Button>
    </form>
  )
}
