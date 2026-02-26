import { PromotionType } from '../enums/promotion'

export interface CreatePromotionDto {
  code: string
  type: PromotionType
  value: number
  minPurchase?: number
  maxDiscount?: number
  usageLimit: number | null
  startsAt: string | null
  expiresAt: string | null
  description: string | null
  isActive: boolean
}
