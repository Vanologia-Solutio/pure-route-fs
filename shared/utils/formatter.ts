import { KeyboardEvent } from 'react'

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
  }).format(amount)
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
