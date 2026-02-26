import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { id } = await params

    const sb = await getSupabaseServerClient()

    const { data: order } = await sb
      .from('orders')
      .select(
        '*, shipment_methods!inner(code), payment_methods!inner(name), promotions(code, type, value)',
      )
      .eq('id', id)
      .single()
    if (!order) {
      return NextResponse.json(generateErrorResponse('Order not found'), {
        status: 404,
      })
    }

    const { data: orderItems } = await sb
      .from('order_items')
      .select('*, products!inner(file_path)')
      .eq('order_id', id)
    if (!orderItems) {
      return NextResponse.json(generateErrorResponse('Order items not found'), {
        status: 404,
      })
    }

    const resPayload = {
      ...order,
      shipment_method: order.shipment_methods.code,
      payment_method: order.payment_methods.name,
      promotion: order.promotions
        ? {
            code: order.promotions.code,
            type: order.promotions.type,
            value: order.promotions.value,
          }
        : null,
      items: orderItems.map(item => ({
        ...item,
        file_path: item.products.file_path,
      })),
    }

    return NextResponse.json(
      generateSuccessResponse(resPayload, 'Order fetched successfully'),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to get order',
      ),
      { status: 500 },
    )
  }
}
