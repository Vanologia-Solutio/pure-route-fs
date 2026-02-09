export type ShipmentMethod = {
  id: number
  code: string
  description: string
  fee: number
  is_active: boolean
}

export type PaymentMethod = {
  id: number
  code: string
  name: string
  is_active: boolean
}
