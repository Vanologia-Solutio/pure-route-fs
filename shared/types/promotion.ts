import { PromotionType } from '../enums/promotion'

export interface Promotion {
  id: number
  created_by: string
  creation_date: string
  updated_by: string
  last_updated: string
  code: string
  type: PromotionType
  value: number
  starts_at: Date | null
  expires_at: Date | null
  is_active: boolean
}
