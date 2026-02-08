import { adminOrderService } from '@/services/admin-order-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const ADMIN_ORDER_QUERY_KEYS = {
  all: ['admin', 'order'] as const,
  list: (page: number, pageSize: number) =>
    [...ADMIN_ORDER_QUERY_KEYS.all, 'list', page, pageSize] as const,
  detail: (id: string) =>
    [...ADMIN_ORDER_QUERY_KEYS.all, 'detail', id] as const,
}

export const adminOrderQueries = {
  keys: ADMIN_ORDER_QUERY_KEYS,

  useGetOrdersPaginated: (page: number = 1, pageSize: number = 10) =>
    useQuery({
      queryKey: adminOrderQueries.keys.list(page, pageSize),
      queryFn: () => adminOrderService.getOrdersPaginated(page, pageSize),
    }),

  useGetOrderById: (id: string) =>
    useQuery({
      queryKey: adminOrderQueries.keys.detail(id),
      queryFn: () => adminOrderService.getOrderById(id),
      enabled: !!id,
    }),

  useUpdateOrderStatus: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) =>
        adminOrderService.updateOrderStatus(id, status),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({
          queryKey: adminOrderQueries.keys.detail(id),
        })
        queryClient.invalidateQueries({ queryKey: ADMIN_ORDER_QUERY_KEYS.all })
      },
    })
  },
}
