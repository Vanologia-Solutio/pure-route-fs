import { promotionService } from '@/services/promotion.service'
import { CreatePromotionDto } from '@/shared/dtos/promotion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const PROMOTION_QUERY_KEYS = {
  all: ['promotion'] as const,
  list: (page: number, pageSize: number) =>
    [...PROMOTION_QUERY_KEYS.all, 'list', page, pageSize] as const,
  create: () => [...PROMOTION_QUERY_KEYS.all, 'create'] as const,
  validate: () => [...PROMOTION_QUERY_KEYS.all, 'validate'] as const,
}

export const promotionQueries = {
  keys: PROMOTION_QUERY_KEYS,

  useGetList: (page: number = 1, pageSize: number = 10) =>
    useQuery({
      queryKey: promotionQueries.keys.list(page, pageSize),
      queryFn: () => promotionService.getPromotions(page, pageSize),
    }),

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: promotionQueries.keys.create(),
      mutationFn: (promotion: CreatePromotionDto) =>
        promotionService.createPromotion(promotion),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: promotionQueries.keys.all,
        })
      },
    })
  },

  useValidate: () =>
    useMutation({
      mutationKey: promotionQueries.keys.validate(),
      mutationFn: (code: string) => promotionService.validatePromotion(code),
    }),
}
