import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sb = await getSupabaseServerClient()
    const { data: paymentMethods } = await sb
      .from('payment_methods')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true })
    return NextResponse.json(
      generateSuccessResponse(
        paymentMethods,
        'Payment methods fetched successfully',
      ),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error
          ? error.message
          : 'Failed to get payment methods',
      ),
      {
        status: 500,
      },
    )
  }
}
