import { CreatePromotionDto } from '@/shared/dtos/promotion'
import { ApiResponse, PaginatedResponse } from '@/shared/helpers/api-response'
import { Promotion, ValidatedPromotion } from '@/shared/types/promotion'
import { getToken } from '@/shared/utils/token'

class PromotionService {
  private headers() {
    return { Authorization: `Bearer ${getToken()}` }
  }

  async getPromotions(
    page: number = 1,
    pageSize: number = 10,
    keyword: string = '',
  ): Promise<PaginatedResponse<Promotion>> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    })
    if (keyword.trim()) {
      params.set('keyword', keyword.trim())
    }
    const res = await fetch(`/api/promotions?${params}`, {
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

  async updatePromotionStatus(
    id: number,
    isActive: boolean,
  ): Promise<ApiResponse<{ id: number; isActive: boolean }>> {
    const res = await fetch('/api/promotions', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers(),
      },
      body: JSON.stringify({ id, isActive }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
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

  async validatePromotion(
    code: string,
  ): Promise<ApiResponse<ValidatedPromotion>> {
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
