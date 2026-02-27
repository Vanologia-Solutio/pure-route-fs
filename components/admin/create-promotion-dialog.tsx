'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { promotionQueries } from '@/hooks/use-promotion'
import { CreatePromotionDto } from '@/shared/dtos/promotion'
import { PromotionType } from '@/shared/enums/promotion'
import { parseDate, startOfDay, toDateValue } from '@/shared/utils/formatter'
import { format } from 'date-fns'
import { CalendarIcon, Loader2, Plus, Truck } from 'lucide-react'
import { type SubmitEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

function valueSuffix(type: PromotionType) {
  if (type === PromotionType.DISCOUNT) return '%'
  if (type === PromotionType.FIXED) return '$'
  if (type === PromotionType.FREE_SHIPPING) return <Truck className='size-4' />
  return '-'
}

// function parseDate(dateValue: string) {
//   if (!dateValue) return undefined
//   const [year, month, day] = dateValue.split('-').map(Number)
//   const parsed =
//     Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
//       ? new Date(year, month - 1, day)
//       : new Date(dateValue)
//   return Number.isNaN(parsed.getTime()) ? undefined : parsed
// }

// function toDateValue(date?: Date) {
//   if (!date) return ''
//   return format(date, 'yyyy-MM-dd')
// }

// function startOfDay(date: Date) {
//   const normalized = new Date(date)
//   normalized.setHours(0, 0, 0, 0)
//   return normalized
// }

export default function CreatePromotionDialog() {
  const { mutateAsync: createPromotion, isPending: isCreatingPromotion } =
    promotionQueries.useCreate()

  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<PromotionType>(
    PromotionType.DISCOUNT,
  )
  const [startsAtValue, setStartsAtValue] = useState('')
  const [expiresAtValue, setExpiresAtValue] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startsAtMaxDate = parseDate(expiresAtValue)
  const expiresAtMinDate = parseDate(startsAtValue) ?? today

  const isFreeShipping = selectedType === PromotionType.FREE_SHIPPING

  const resetStates = () => {
    formRef.current?.reset()
    setSelectedType(PromotionType.DISCOUNT)
    setStartsAtValue('')
    setExpiresAtValue('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) resetStates()
  }

  const handleTypeChange = (type: PromotionType) => {
    const valueInput = formRef.current?.elements.namedItem(
      'value',
    ) as HTMLInputElement | null
    if (type === PromotionType.FREE_SHIPPING && valueInput) {
      valueInput.value = ''
    }
    setSelectedType(type)
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const payload: CreatePromotionDto = {
        code: String(formData.get('code') ?? ''),
        type: selectedType,
        value: Number(formData.get('value') ?? 0),
        usageLimit: Number(formData.get('usageLimit') ?? null),
        startsAt: startsAtValue || null,
        expiresAt: expiresAtValue || null,
        description: String(formData.get('description') ?? '').trim() || null,
        isActive: formData.get('isActive') === 'on',
      }
      const res = await createPromotion(payload)
      if (res.success) {
        toast.success('Promotion created successfully')
        setOpen(false)
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create promotion',
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type='button'
          className='bg-green-700 text-white hover:bg-green-800'
        >
          <Plus className='size-4' />
          Add Promo Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Promotion</DialogTitle>
          <DialogDescription>
            Fill in the promo details before creating the code.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className='space-y-4'>
          <FieldGroup className='grid gap-4 md:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='promo-code'>Code</FieldLabel>
              <Input
                id='promo-code'
                name='code'
                placeholder='WELCOME10'
                required
                disabled={isCreatingPromotion}
              />
            </Field>

            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select
                name='type'
                defaultValue={PromotionType.DISCOUNT}
                onValueChange={value =>
                  handleTypeChange(value as PromotionType)
                }
                disabled={isCreatingPromotion}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PromotionType.DISCOUNT}>
                    Discount
                  </SelectItem>
                  <SelectItem value={PromotionType.FIXED}>Fixed</SelectItem>
                  <SelectItem value={PromotionType.FREE_SHIPPING}>
                    Free Shipping
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor='promo-value'>Value</FieldLabel>
              <div className='relative'>
                <Input
                  id='promo-value'
                  type='number'
                  min={0}
                  step='any'
                  name='value'
                  disabled={isFreeShipping || isCreatingPromotion}
                  className='pr-10'
                  placeholder={isFreeShipping ? 'Value is not required' : '0'}
                  required={!isFreeShipping}
                />
                <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
                  {valueSuffix(selectedType)}
                </div>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor='promo-usage-limit'>Usage Limit</FieldLabel>
              <Input
                id='promo-usage-limit'
                type='number'
                min={1}
                name='usageLimit'
                placeholder='100'
                disabled={isCreatingPromotion}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='promo-starts-at'>Starts At</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='promo-starts-at'
                    type='button'
                    variant='outline'
                    className='w-full justify-start font-normal'
                    disabled={isCreatingPromotion}
                  >
                    <CalendarIcon className='size-4' />
                    {startsAtValue ? (
                      format(parseDate(startsAtValue) ?? new Date(), 'PPP')
                    ) : (
                      <span className='text-muted-foreground'>
                        Pick a start date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={parseDate(startsAtValue)}
                    disabled={date =>
                      startOfDay(date) < today ||
                      (!!startsAtMaxDate &&
                        startOfDay(date) > startOfDay(startsAtMaxDate))
                    }
                    onSelect={date => {
                      const nextStartsAt = toDateValue(date)
                      const startsAtInput = formRef.current?.elements.namedItem(
                        'startsAt',
                      ) as HTMLInputElement | null
                      if (startsAtInput) startsAtInput.value = nextStartsAt
                      setStartsAtValue(nextStartsAt)
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Input type='hidden' name='startsAt' defaultValue='' />
            </Field>

            <Field>
              <FieldLabel htmlFor='promo-expires-at'>Expires At</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='promo-expires-at'
                    disabled={!startsAtValue || isCreatingPromotion}
                    type='button'
                    variant='outline'
                    className='w-full justify-start font-normal'
                  >
                    <CalendarIcon className='size-4' />
                    {expiresAtValue ? (
                      format(parseDate(expiresAtValue) ?? new Date(), 'PPP')
                    ) : (
                      <span className='text-muted-foreground'>
                        Pick an expiration date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={parseDate(expiresAtValue)}
                    disabled={date =>
                      startOfDay(date) < startOfDay(expiresAtMinDate)
                    }
                    onSelect={date => {
                      const expiresAtInput =
                        formRef.current?.elements.namedItem(
                          'expiresAt',
                        ) as HTMLInputElement | null
                      const nextExpiresAt = toDateValue(date)
                      if (expiresAtInput) expiresAtInput.value = nextExpiresAt
                      setExpiresAtValue(nextExpiresAt)
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Input type='hidden' name='expiresAt' defaultValue='' />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor='promo-description'>Description</FieldLabel>
            <Textarea
              id='promo-description'
              name='description'
              placeholder='Add campaign details...'
              disabled={isCreatingPromotion}
            />
          </Field>

          <Field orientation='horizontal' className='rounded-md border p-3'>
            <FieldContent>
              <FieldLabel htmlFor='promo-active'>Active status</FieldLabel>
              <FieldDescription>
                Toggle to immediately activate this promo.
              </FieldDescription>
            </FieldContent>
            <Switch
              id='promo-active'
              name='isActive'
              defaultChecked
              disabled={isCreatingPromotion}
            />
          </Field>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                resetStates()
                setOpen(false)
              }}
              disabled={isCreatingPromotion}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-green-700 text-white hover:bg-green-800'
              disabled={isCreatingPromotion}
            >
              {isCreatingPromotion ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                'Create Promo'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
