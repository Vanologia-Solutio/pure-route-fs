import { productService } from '@/services/product-service'
import { useQuery } from '@tanstack/react-query'

const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
}

export const productQueries = {
  keys: PRODUCT_QUERY_KEYS,

  useList: () =>
    useQuery({
      queryKey: productQueries.keys.list(),
      queryFn: () => productService.getProducts(),
    }),
}
