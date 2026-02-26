import { ShipmentMethod } from './master-data'

export interface OrderItem {
  id: number
  created_by: number
  creation_date: string
  updated_by: number | null
  last_updated: string | null
  product_name: string
  quantity: number
  price_snapshot: number
}

export interface Order {
  id: number
  code: string
  address: string
  city: string
  country: string
  state: string
  postal_code: string
  recipient_name: string
  phone_no: string
  contact_info: string
  user_id: number
  subtotal_amount: number
  delivery_fee_snapshot: number
  promotion_id?: number
  discount_amount?: number
  promotion?: { code: string; type: string; value: number } | null
  total_amount: number
  payment_method: string
  shipment_method: string
  shipment_method_id: number
  shipment_methods: Pick<ShipmentMethod, 'code'>
  items: OrderItem[]
  status: string
  cancelled_at: string | null
  completed_at: string | null
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  creation_date: string
  created_by: number
  last_updated: string | null
  updated_by: number | null
}

export type AdminOrderListItem = {
  id: number
  code: string
  status: string
  total_amount: number
  creation_date: string
  recipient_name: string
  contact_info: string
  country: string
  address: string
  city: string
  state: string
  postal_code: string
}
