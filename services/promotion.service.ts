import { CreatePromotionDto } from '@/shared/dtos/promotion'
import { PromotionType } from '@/shared/enums/promotion'
import { ApiResponse } from '@/shared/helpers/api-response'
import { getToken } from '@/shared/utils/token'

class PromotionService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async createPromotion(
    promotion: CreatePromotionDto,
  ): Promise<ApiResponse<{ id: string }>> {
    const res = await fetch('/api/promotions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
      body: JSON.stringify(promotion),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async validatePromotion(code: string): Promise<
    ApiResponse<{
      id: number
      code: string
      type: PromotionType
      value: number
    }>
  > {
    const res = await fetch('/api/promotions/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
      body: JSON.stringify({ code }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }
}

export const promotionService = new PromotionService()
