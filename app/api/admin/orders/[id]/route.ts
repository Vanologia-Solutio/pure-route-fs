import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { OrderStatus } from '@/shared/enums/status'
import { isAuthFailed, requireAdmin } from '@/shared/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

const VALID_STATUSES = Object.values(OrderStatus)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req)
  if (isAuthFailed(auth)) return auth

  try {
    const { id } = await params
    const sb = await getSupabaseServerClient()

    const { data: order, error: orderError } = await sb
      .from('orders')
      .select('*, shipment_methods!inner(code)')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(generateErrorResponse('Order not found'), {
        status: 404,
      })
    }

    const { data: orderItems } = await sb
      .from('order_items')
      .select('*, products!inner(file_path)')
      .eq('order_id', id)

    const items = (orderItems ?? []).map(
      (item: { products?: { file_path?: string } }) => ({
        ...item,
        file_path: item.products?.file_path,
      }),
    )

    const resPayload = {
      ...order,
      shipment_method: order.shipment_methods?.code ?? order.shipment_method,
      items,
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req)
  if (isAuthFailed(auth)) return auth

  try {
    const { id } = await params
    const body = await req.json()
    const { status } = body as { status?: string }

    if (!status || typeof status !== 'string') {
      return NextResponse.json(generateErrorResponse('status is required'), {
        status: 400,
      })
    }

    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json(
        generateErrorResponse(
          `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`,
        ),
        { status: 400 },
      )
    }

    const sb = await getSupabaseServerClient()

    const { data: updated, error } = await sb
      .from('orders')
      .update({
        status,
        updated_by: auth.sub,
        last_updated: new Date().toISOString(),
        ...(status === OrderStatus.CANCELLED && {
          cancelled_at: new Date().toISOString(),
        }),
        ...(status === OrderStatus.COMPLETED && {
          completed_at: new Date().toISOString(),
        }),
        ...(status === OrderStatus.DELIVERED && {
          delivered_at: new Date().toISOString(),
        }),
        ...(status === OrderStatus.SHIPPED && {
          shipped_at: new Date().toISOString(),
        }),
        ...(status === OrderStatus.PAID && {
          paid_at: new Date().toISOString(),
        }),
      })
      .eq('id', id)
      .select('id, status')
      .single()

    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
        status: 500,
      })
    }

    return NextResponse.json(
      generateSuccessResponse(updated, 'Order status updated'),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to update order',
      ),
      { status: 500 },
    )
  }
}
