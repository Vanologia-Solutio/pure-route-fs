import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PromotionType } from '@/shared/enums/promotion'
import {
  generateErrorResponse,
  generatePaginatedResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') ?? 1))
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get('pageSize') ?? 10)),
    )
    const keyword = (searchParams.get('keyword') ?? '').trim()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const sb = await getSupabaseServerClient()
    let query = sb
      .from('promotions')
      .select('*', { count: 'exact' })
      .order('id', { ascending: false })

    if (keyword) {
      query = query.ilike('code', `%${keyword}%`)
    }

    const { data: promotions, count, error } = await query.range(from, to)
    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
        status: 500,
      })
    }

    const total = count ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    return NextResponse.json(
      generatePaginatedResponse(
        promotions ?? [],
        {
          currentPage: page,
          pageSize,
          total,
          totalPages,
        },
        'Promotions fetched successfully',
      ),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to get promotions',
      ),
      {
        status: 500,
      },
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { id, isActive } = await req.json()
    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        generateErrorResponse('Promotion id and isActive are required'),
        { status: 400 },
      )
    }

    const sb = await getSupabaseServerClient()
    const { data: updatedPromotion, error } = await sb
      .from('promotions')
      .update({
        is_active: isActive,
        updated_by: auth.sub,
        last_updated: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, is_active')
      .single()
    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
        status: 500,
      })
    }

    return NextResponse.json(
      generateSuccessResponse(
        {
          id: updatedPromotion.id,
          isActive: updatedPromotion.is_active,
        },
        'Promotion status updated successfully',
      ),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to update promotion',
      ),
      {
        status: 500,
      },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { code, type, value, startsAt, expiresAt, description, isActive } =
      await req.json()

    if (!code || !type) {
      return NextResponse.json(
        generateErrorResponse('Code and type are required'),
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

    const sanitizedCode = code.trim().toUpperCase()

    const sb = await getSupabaseServerClient()
    const { data: existingPromotion } = await sb
      .from('promotions')
      .select('id')
      .eq('code', sanitizedCode)
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
          code: sanitizedCode,
          type,
          value,
          starts_at: startsAt ?? null,
          expires_at: expiresAt ?? null,
          created_by: auth.sub,
          description: description ?? null,
          is_active: isActive,
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
