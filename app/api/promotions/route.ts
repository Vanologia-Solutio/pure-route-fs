import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PromotionType } from '@/shared/enums/promotion'
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

    const { code, type, value, startsAt, expiresAt } = await req.json()

    if (!code || !type || value <= 0) {
      return NextResponse.json(
        generateErrorResponse('Code, type, and positive value are required'),
        {
          status: 400,
        },
      )
    }

    if (!Object.values(PromotionType).includes(type)) {
      return NextResponse.json(
        generateErrorResponse('Invalid promotion type'),
        {
          status: 400,
        },
      )
    }

    const sb = await getSupabaseServerClient()
    const { data: existingPromotion } = await sb
      .from('promotions')
      .select('id')
      .eq('code', code)
      .single()
    if (existingPromotion) {
      return NextResponse.json(
        generateErrorResponse('Promotion code already exists'),
        {
          status: 400,
        },
      )
    }

    const { data: newPromotion, error } = await sb
      .from('promotions')
      .insert([
        {
          code,
          type,
          value,
          starts_at: startsAt ?? null,
          expires_at: expiresAt ?? null,
          created_by: auth.sub,
        },
      ])
      .select('*')
      .single()
    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
        status: 500,
      })
    }

    return NextResponse.json(
      generateSuccessResponse(
        { id: newPromotion.id },
        'Promotion created successfully',
      ),
      {
        status: 201,
      },
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to create promotion',
      ),
      { status: 500 },
    )
  }
}
