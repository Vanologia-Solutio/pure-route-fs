import { ApiResponse } from '@/shared/helpers/api-response'
import { PaymentMethod, ShipmentMethod } from '@/shared/types/master-data'

export class MasterDataService {
  async getShipmentMethods(): Promise<ApiResponse<ShipmentMethod[]>> {
    const res = await fetch('/api/master-data/shipment-methods')
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    const res = await fetch('/api/master-data/payment-methods')
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }
}

export const masterDataService = new MasterDataService()
