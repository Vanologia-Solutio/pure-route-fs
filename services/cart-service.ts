import { ApiResponse } from '@/shared/helpers/api-response'
import { Cart } from '@/shared/types/cart'
import { getToken } from '@/shared/utils/token'

export class CartService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async getCartDetails(): Promise<ApiResponse<Cart>> {
    const res = await fetch('/api/cart', { headers: this.headers() })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async addItem(
    productId: string,
    quantity: number,
  ): Promise<ApiResponse<null>> {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
      body: JSON.stringify({ productId, quantity }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async updateItemQuantity(
    productId: number,
    quantity: number,
  ): Promise<ApiResponse<null>> {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
      body: JSON.stringify({ productId, quantity }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async removeItem(productId: string): Promise<ApiResponse<null>> {
    const res = await fetch(
      `/api/cart?productId=${encodeURIComponent(productId)}`,
      {
        method: 'DELETE',
        headers: this.headers(),
      },
    )
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }
}

export const cartService = new CartService()
