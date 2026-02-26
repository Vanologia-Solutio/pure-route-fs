import { ApiResponse, PaginatedResponse } from '@/shared/helpers/api-response'
import { AdminOrderListItem, Order } from '@/shared/types/order'
import { getToken } from '@/shared/utils/token'

export class AdminOrderService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async getOrdersPaginated(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponse<AdminOrderListItem>> {
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
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async getOrderById(
    id: string,
  ): Promise<ApiResponse<Order & { items: unknown[] }>> {
    const res = await fetch(`/api/admin/orders/${id}`, {
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

  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<{ id: number; status: string }>> {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }
}

export const adminOrderService = new AdminOrderService()
