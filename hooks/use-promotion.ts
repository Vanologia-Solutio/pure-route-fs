import { promotionService } from '@/services/promotion.service'
import { CreatePromotionDto } from '@/shared/dtos/promotion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const PROMOTION_QUERY_KEYS = {
  all: ['promotion'] as const,
  list: (page: number, pageSize: number, keyword: string) =>
    [...PROMOTION_QUERY_KEYS.all, 'list', page, pageSize, keyword] as const,
  create: () => [...PROMOTION_QUERY_KEYS.all, 'create'] as const,
  updateStatus: () => [...PROMOTION_QUERY_KEYS.all, 'update-status'] as const,
  validate: () => [...PROMOTION_QUERY_KEYS.all, 'validate'] as const,
}

export const promotionQueries = {
  keys: PROMOTION_QUERY_KEYS,

  useGetList: (page: number = 1, pageSize: number = 10, keyword: string = '') =>
    useQuery({
      queryKey: promotionQueries.keys.list(page, pageSize, keyword),
      queryFn: () => promotionService.getPromotions(page, pageSize, keyword),
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

  useUpdateStatus: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: promotionQueries.keys.updateStatus(),
      mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
        promotionService.updatePromotionStatus(id, isActive),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: promotionQueries.keys.all,
        })
      },
    })
  },
}
