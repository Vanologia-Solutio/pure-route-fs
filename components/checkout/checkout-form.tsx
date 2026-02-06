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
import { formatCurrency } from '@/shared/utils/formatter'
import { PackageCheck } from 'lucide-react'
import { SubmitEvent } from 'react'

interface CheckoutFormProps {
  shipment: string
  setShipment: (v: string) => void
  payment: string
  setPayment: (v: string) => void
}

export default function CheckoutForm({
  shipment,
  setShipment,
  payment,
  setPayment,
}: CheckoutFormProps) {
  const { user } = useAuthStore()

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    // Use formData as needed for order submission
    console.log(Object.fromEntries(formData.entries()))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
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
                required
              />
            </Field>
            <Field>
              <Select name='country' required>
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
                  required
                />
              </Field>
              <Field>
                <Select name='state' required>
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
                  defaultValue=''
                  required
                />
              </Field>
              <Field>
                <Input
                  id='phone'
                  name='phone'
                  placeholder='Phone (optional)'
                  defaultValue=''
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
            name='shipment'
            value={shipment}
            onValueChange={setShipment}
          >
            {CHECKOUT_LOV.SHIPMENT_METHODS.map(method => (
              <FieldLabel key={method.id} htmlFor={method.id}>
                <Field orientation='horizontal'>
                  <FieldContent>
                    <FieldTitle>
                      {method.name} ({formatCurrency(method.price)})
                    </FieldTitle>
                    <FieldDescription>{method.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={method.id} id={method.id} />
                </Field>
              </FieldLabel>
            ))}
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
              name='payment'
              value={payment}
              onValueChange={setPayment}
            >
              {CHECKOUT_LOV.PAYMENT_METHODS.map(method => (
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
      >
        <PackageCheck className='size-4' />
        Place Order
      </Button>
    </form>
  )
}
