import { PromotionType } from '../enums/promotion'

export interface CreatePromotionDto {
  code: string
  type: PromotionType
  value: number
  minPurchase: number | null
  maxDiscount: number | null
  usageLimit: number | null
  startsAt: Date | null
  expiresAt: Date | null
}
