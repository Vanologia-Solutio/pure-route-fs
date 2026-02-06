import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sb = await getSupabaseServerClient()
    const { data: products } = await sb.from('products').select('*')
    return NextResponse.json(
      generateSuccessResponse(products, 'Products fetched successfully'),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to get products',
      ),
      { status: 500 },
    )
  }
}
