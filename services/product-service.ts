import { ApiResponse } from '@/shared/helpers/api-response'
import { Product } from '@/shared/types/product'

export class ProductService {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const res = await fetch('/api/products')
      return await res.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred')
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const res = await fetch(`/api/products/${id}`)
      return await res.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred')
    }
  }
}

export const productService = new ProductService()
