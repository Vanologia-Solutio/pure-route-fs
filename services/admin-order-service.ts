import { ApiResponse } from '@/shared/helpers/api-response'
import { PaginatedResponse } from '@/shared/helpers/api-response'
import { Order } from '@/shared/types/order'
import { getToken } from '@/shared/utils/token'

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

export class AdminOrderService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async getOrdersPaginated(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponse<AdminOrderListItem>> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      })
      const res = await fetch(`/api/admin/orders?${params}`, {
        method: 'GET',
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

  async getOrderById(
    id: string,
  ): Promise<ApiResponse<Order & { items: unknown[] }>> {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'GET',
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

  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<{ id: number; status: string }>> {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers(),
        },
        body: JSON.stringify({ status }),
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

export const adminOrderService = new AdminOrderService()
