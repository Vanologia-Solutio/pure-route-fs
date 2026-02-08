import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generatePaginatedResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAdmin } from '@/shared/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

export type AdminOrderListItem = {
  id: number
  code: string
  status: string
  total_amount: number
  creation_date: string
  recipient_name: string
  contact_info: string
  country: string
  address: string
  city: string
  state: string
  postal_code: string
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (isAuthFailed(auth)) return auth

  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE),
    )

    const sb = await getSupabaseServerClient()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const {
      data: orders,
      error,
      count,
    } = await sb
      .from('orders')
      .select(
        'id, code, status, total_amount, creation_date, recipient_name, contact_info, country, address, city, state, postal_code',
        { count: 'exact' },
      )
      .order('id', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
        status: 500,
      })
    }

    const total = count ?? 0
    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json(
      generatePaginatedResponse(
        (orders ?? []) as AdminOrderListItem[],
        {
          currentPage: page,
          pageSize,
          total,
          totalPages,
        },
        'Orders fetched successfully',
      ),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to get orders',
      ),
      { status: 500 },
    )
  }
}
