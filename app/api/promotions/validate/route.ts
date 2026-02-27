import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
import { format } from 'date-fns'
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

    const sanitizedCode = code.trim().toUpperCase()
    const today = format(new Date(), 'yyyy-MM-dd')

    const sb = await getSupabaseServerClient()
    const { data: promotion } = await sb
      .from('promotions')
      .select('*')
      .eq('code', sanitizedCode)
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${today}`)
      .or(`expires_at.is.null,expires_at.gte.${today}`)
      .single()
    if (!promotion) {
      return NextResponse.json(generateErrorResponse('Invalid promo code'), {
        status: 404,
      })
    }

    const { data: promotionUsage } = await sb
      .from('promotion_usages')
      .select('*')
      .eq('promotion_id', promotion.id)
      .eq('user_id', auth.sub)
      .single()
    if (promotionUsage) {
      return NextResponse.json(
        generateErrorResponse('Promo code already used'),
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
