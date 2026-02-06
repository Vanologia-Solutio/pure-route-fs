import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const sb = await getSupabaseServerClient()
    const { data: product } = await sb
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    return NextResponse.json(
      generateSuccessResponse(product, 'Product fetched successfully'),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to get product',
      ),
      { status: 500 },
    )
  }
}
