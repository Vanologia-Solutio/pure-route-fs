import { promotionService } from '@/services/promotion.service'
import { CreatePromotionDto } from '@/shared/dtos/promotion'
import { useMutation } from '@tanstack/react-query'

const PROMOTION_QUERY_KEYS = {
  all: ['promotion'] as const,
  create: () => [...PROMOTION_QUERY_KEYS.all, 'create'] as const,
  validate: () => [...PROMOTION_QUERY_KEYS.all, 'validate'] as const,
}

export const promotionQueries = {
  keys: PROMOTION_QUERY_KEYS,

  useCreate: () =>
    useMutation({
      mutationKey: promotionQueries.keys.create(),
      mutationFn: (promotion: CreatePromotionDto) =>
        promotionService.createPromotion(promotion),
    }),

  useValidate: () =>
    useMutation({
      mutationKey: promotionQueries.keys.validate(),
      mutationFn: (code: string) => promotionService.validatePromotion(code),
    }),
}
