import { ApiResponse } from '@/shared/helpers/api-response'
import { Cart } from '@/shared/types/cart'
import { getToken } from '@/shared/utils/token'

export class CartService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async getCartDetails(): Promise<ApiResponse<Cart>> {
    try {
      const res = await fetch('/api/cart', { headers: this.headers() })
      return await res.json()
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
      throw new Error('An unknown error occurred')
    }
  }

  async addItem(
    productId: string,
    quantity: number,
  ): Promise<ApiResponse<null>> {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers(),
        },
        body: JSON.stringify({ productId, quantity }),
      })
      return await res.json()
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
      throw new Error('An unknown error occurred')
    }
  }

  async updateItemQuantity(
    productId: number,
    quantity: number,
  ): Promise<ApiResponse<null>> {
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...this.headers() },
        body: JSON.stringify({ productId, quantity }),
      })
      return await res.json()
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
      throw new Error('An unknown error occurred')
    }
  }

  async removeItem(productId: string): Promise<ApiResponse<null>> {
    try {
      const res = await fetch(
        `/api/cart?productId=${encodeURIComponent(productId)}`,
        {
          method: 'DELETE',
          headers: this.headers(),
        },
      )
      return await res.json()
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
      throw new Error('An unknown error occurred')
    }
  }
}

export const cartService = new CartService()
