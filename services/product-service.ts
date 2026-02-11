import { ApiResponse } from '@/shared/helpers/api-response'
import { Product } from '@/shared/types/product'

export class ProductService {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const res = await fetch('/api/products')
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const res = await fetch(`/api/products/${id}`)
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }
}

export const productService = new ProductService()
