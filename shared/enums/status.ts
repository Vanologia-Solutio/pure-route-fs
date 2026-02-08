export enum CartStatus {
  ACTIVE = 'active',
  CONVERTED = 'converted',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  ZELLE = 'zelle',
  CASHAPP = 'cashapp',
  BITCOIN = 'bitcoin',
}
