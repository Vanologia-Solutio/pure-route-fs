import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { code } = await req.json()
    if (!code) {
      return NextResponse.json(generateErrorResponse('Code is required'), {
        status: 400,
      })
    }

    const sb = await getSupabaseServerClient()
    const { data: promotion } = await sb
      .from('promotions')
      .select('*')
      .eq('code', code)
      .single()
    console.log(promotion)
    if (!promotion) {
      return NextResponse.json(generateErrorResponse('Promotion not found'), {
        status: 404,
      })
    }

    const { data: promotionUsage } = await sb
      .from('promotion_usages')
      .select('*')
      .eq('promotion_id', promotion.id)
      .eq('user_id', auth.sub)
      .single()
    console.log(promotionUsage)
    if (promotionUsage) {
      return NextResponse.json(
        generateErrorResponse('Promotion already used'),
        {
          status: 400,
        },
      )
    }

    return NextResponse.json(
      generateSuccessResponse(
        {
          id: promotion.id,
          code: promotion.code,
          type: promotion.type,
          value: promotion.value,
          description: promotion.description,
        },
        'Promotion validated successfully',
      ),
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to validate promotion',
      ),
      { status: 500 },
    )
  }
}
