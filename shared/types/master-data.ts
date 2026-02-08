export type ShipmentMethod = {
  id: string
  code: string
  description: string
  fee: number
  is_active: boolean
}

export type PaymentMethod = {
  id: string
  code: string
  name: string
  is_active: boolean
}
