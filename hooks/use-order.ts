import { orderService } from '@/services/order-service'
import { CreateOrderDto } from '@/shared/dtos/order'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartQueries } from './use-cart'

const ORDER_QUERY_KEYS = {
  all: ['order'] as const,
  list: () => [...ORDER_QUERY_KEYS.all, 'list'] as const,
  getById: (id: string) => [...ORDER_QUERY_KEYS.all, 'getById', id] as const,
  create: () => [...ORDER_QUERY_KEYS.all, 'create'] as const,
}

export const orderQueries = {
  keys: ORDER_QUERY_KEYS,

  useGetList: () =>
    useQuery({
      queryKey: orderQueries.keys.list(),
      queryFn: () => orderService.getOrders(),
    }),

  useGetById: (id: string) => {
    return useQuery({
      queryKey: orderQueries.keys.getById(id),
      queryFn: () => orderService.getOrderById(id),
    })
  },

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
        queryClient.invalidateQueries({
          queryKey: orderQueries.keys.list(),
        })
      },
    })
  },
}
