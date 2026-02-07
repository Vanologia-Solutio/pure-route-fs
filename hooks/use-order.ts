import { orderService } from '@/services/order-service'
import { CreateOrderDto } from '@/shared/dtos/order'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartQueries } from './use-cart'

const ORDER_QUERY_KEYS = {
  all: ['order'] as const,
  create: () => [...ORDER_QUERY_KEYS.all, 'create'] as const,
}

export const orderQueries = {
  keys: ORDER_QUERY_KEYS,

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: orderQueries.keys.create(),
      mutationFn: (payload: CreateOrderDto) =>
        orderService.createOrder(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: cartQueries.keys.getDetails(),
        })
      },
    })
  },
}
