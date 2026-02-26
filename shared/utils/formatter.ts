import { KeyboardEvent } from 'react'
import { OrderStatus } from '../enums/status'

export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

export function formatNpwp(npwp: string): string {
  if (npwp.length === 15)
    return npwp.replace(
      /(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/,
      '$1.$2.$3.$4-$5.$6',
    )
  return npwp
}

export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

export function sanitizeOptions(
  options?: Array<{ value: number | string | null; label: string }>,
): Array<{ value: number | string | null; label: string }> | undefined {
  if (!options) return undefined
  return options.filter(
    opt =>
      opt &&
      typeof opt.label === 'string' &&
      (typeof opt.value === 'string' ||
        typeof opt.value === 'number' ||
        opt.value === null),
  )
}

export const numericSeparator = (
  value: string | number | undefined,
): string => {
  if (value === undefined || value === null || value === '') return ''

  const normalized =
    typeof value === 'number'
      ? value
      : Number(value.replace(/\./g, '').replace(',', '.'))

  if (Number.isNaN(normalized)) return ''

  return normalized.toLocaleString('id-ID')
}

export const parseSeparator = (value: string | undefined): number => {
  return Number(value?.replace(/\./g, '').replace(',', '.'))
}

export const restrictToNumericInput = (e: KeyboardEvent): void => {
  const onlyNumber = /^[0-9\b]+$/
  const allowedKeys = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Backspace',
    'Delete',
    'Tab',
    'Enter',
    'Control',
    'Shift',
    'Alt',
    'c',
    'v',
    'C',
    'V',
  ]

  if (!onlyNumber.test(e.key) && !allowedKeys.includes(e.key)) {
    e.preventDefault()
  }
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function statusVariantClassName(status: string): string {
  switch (status?.toLowerCase()) {
    case OrderStatus.COMPLETED:
    case OrderStatus.DELIVERED:
      return 'bg-green-500/10 text-green-700'
    case OrderStatus.CANCELLED:
      return 'bg-red-500/10 text-red-700'
    case OrderStatus.PENDING:
      return 'bg-yellow-500/10 text-yellow-700'
    case OrderStatus.PAID:
      return 'bg-blue-500/10 text-blue-700'
    case OrderStatus.SHIPPED:
      return 'bg-purple-500/10 text-purple-700'
    default:
      return 'bg-neutral-500/10 text-neutral-700'
  }
}
