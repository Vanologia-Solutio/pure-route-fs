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
import { useAuthStore } from '@/shared/stores/auth-store'
import { ShipmentMethod } from '@/shared/types/master-data'
import { formatCurrency } from '@/shared/utils/formatter'
import { Loader2, PackageCheck } from 'lucide-react'
import { SubmitEvent } from 'react'
import { Skeleton } from '../ui/skeleton'

interface CheckoutFormProps {
  shipmentMethods: ShipmentMethod[]
  shipmentMethod: string
  setShipmentMethod: (v: string) => void
  paymentMethods: { id: string; name: string }[]
  paymentMethod: string
  setPaymentMethod: (v: string) => void
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void
  states: {
    isCartLoading: boolean
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
    states.isShipmentMethodsLoading ||
    states.isCreateOrderLoading

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Contact Information</CardTitle>
          <CardDescription>
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
          <CardTitle className='text-lg'>Shipping Address</CardTitle>
          <CardDescription>
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
                    <SelectItem value='United States (US)'>
                      United States (US)
                    </SelectItem>
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
                      <SelectItem value='California'>California</SelectItem>
                      <SelectItem value='New York'>New York</SelectItem>
                      <SelectItem value='Texas'>Texas</SelectItem>
                      <SelectItem value='Florida'>Florida</SelectItem>
                      <SelectItem value='Illinois'>Illinois</SelectItem>
                      <SelectItem value='Michigan'>Michigan</SelectItem>
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
      <Card className='border-slate-200 bg-white shadow-sm'>
        <CardHeader>
          <CardTitle className='text-lg text-slate-900'>
            Shipment Method
          </CardTitle>
          <CardDescription>
            Choose your preferred delivery speed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            name='shipmentMethod'
            value={shipmentMethod}
            onValueChange={setShipmentMethod}
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
              shipmentMethods.map(method => (
                <FieldLabel key={method.id} htmlFor={method.id}>
                  <Field orientation='horizontal'>
                    <FieldContent>
                      <FieldTitle>
                        {method.code} ({formatCurrency(method.fee)})
                      </FieldTitle>
                      <FieldDescription>{method.description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={method.id} id={method.id} />
                  </Field>
                </FieldLabel>
              ))
            )}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className='border-slate-200 bg-white shadow-sm'>
        <CardHeader>
          <CardTitle className='text-lg text-slate-900'>
            Payment Method
          </CardTitle>
          <CardDescription>Select how you would like to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <RadioGroup
              name='paymentMethod'
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              disabled={isGlobalDisabled}
              required
            >
              {paymentMethods.map(method => (
                <FieldLabel key={method.id} htmlFor={method.id}>
                  <Field orientation='horizontal'>
                    <FieldContent>
                      <FieldTitle>{method.name}</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value={method.id} id={method.id} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </Field>
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
