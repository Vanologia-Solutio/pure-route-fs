import { cartService } from '@/services/cart-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const CART_QUERY_KEYS = {
  all: ['cart'] as const,
  getDetails: () => [...CART_QUERY_KEYS.all, 'getDetails'] as const,
}

export const cartQueries = {
  keys: CART_QUERY_KEYS,

  useGetDetails: (role: string) =>
    useQuery({
      queryKey: cartQueries.keys.getDetails(),
      queryFn: () => cartService.getCartDetails(),
      enabled: role === 'user',
    }),

  useAddItem: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({
        productId,
        quantity,
      }: {
        productId: string
        quantity: number
      }) => cartService.addItem(productId, quantity),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: cartQueries.keys.getDetails(),
        })
      },
    })
  },

  useUpdateQuantity: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({
        productId,
        quantity,
      }: {
        productId: string
        quantity: number
      }) => cartService.updateItemQuantity(productId, quantity),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: cartQueries.keys.getDetails(),
        })
      },
    })
  },

  useRemoveItem: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (productId: string) => cartService.removeItem(productId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: cartQueries.keys.getDetails(),
        })
      },
    })
  },
}
