import { CreateOrderDto } from '@/shared/dtos/order'
import { ApiResponse } from '@/shared/helpers/api-response'
import { Order } from '@/shared/types/order'
import { getToken } from '@/shared/utils/token'

export class OrderService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const res = await fetch('/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async createOrder(
    payload: CreateOrderDto,
  ): Promise<ApiResponse<{ id: string }>> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }
}

export const orderService = new OrderService()
