import { productService } from '@/services/product-service'
import { useQuery } from '@tanstack/react-query'

const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  getById: (id: string) => [...PRODUCT_QUERY_KEYS.all, 'getById', id] as const,
}

export const productQueries = {
  keys: PRODUCT_QUERY_KEYS,

  useList: () =>
    useQuery({
      queryKey: productQueries.keys.list(),
      queryFn: () => productService.getProducts(),
    }),

  useGetById: (id: string) =>
    useQuery({
      queryKey: productQueries.keys.getById(id),
      queryFn: () => productService.getProductById(id),
      enabled: !!id,
    }),
}
