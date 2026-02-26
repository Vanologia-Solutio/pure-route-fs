export interface CreateOrderDto {
  address: string
  city: string
  country: string
  email: string
  paymentMethod: string
  phone?: string | null
  postalCode: string
  recipientName: string
  shipmentMethod: string
  state: string
  promotionId?: string
}
