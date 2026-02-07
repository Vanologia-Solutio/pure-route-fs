import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sb = await getSupabaseServerClient()
    const { data: shipmentMethods } = await sb
      .from('shipment_methods')
      .select('*')
    return NextResponse.json(
      generateSuccessResponse(
        shipmentMethods,
        'Shipment methods fetched successfully',
      ),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error
          ? error.message
          : 'Failed to get shipment methods',
      ),
      {
        status: 500,
      },
    )
  }
}
