import { CreateOrderDto } from '@/shared/dtos/order'
import { ApiResponse } from '@/shared/helpers/api-response'
import { getToken } from '@/shared/utils/token'

export class OrderService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async createOrder(
    payload: CreateOrderDto,
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 10000))
      const res = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          ...this.headers(),
        },
      })
      return await res.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred')
    }
  }
}

export const orderService = new OrderService()
