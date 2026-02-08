import { ApiResponse } from '@/shared/helpers/api-response'
import { PaymentMethod, ShipmentMethod } from '@/shared/types/master-data'

export class MasterDataService {
  async getShipmentMethods(): Promise<ApiResponse<ShipmentMethod[]>> {
    try {
      const res = await fetch('/api/master-data/shipment-methods')
      return await res.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred')
    }
  }

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      const res = await fetch('/api/master-data/payment-methods')
      return await res.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred')
    }
  }
}

export const masterDataService = new MasterDataService()
