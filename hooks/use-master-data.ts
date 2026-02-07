import { masterDataService } from '@/services/master-data-service'
import { useQuery } from '@tanstack/react-query'

const MASTER_DATA_QUERY_KEYS = {
  all: ['master-data'] as const,
  shipmentMethods: () =>
    [...MASTER_DATA_QUERY_KEYS.all, 'shipment-methods'] as const,
}

export const masterDataQueries = {
  keys: MASTER_DATA_QUERY_KEYS,

  useGetShipmentMethods: () =>
    useQuery({
      queryKey: masterDataQueries.keys.shipmentMethods(),
      queryFn: () => masterDataService.getShipmentMethods(),
    }),
}
