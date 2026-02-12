import { sendOrderEmail } from '@/lib/mailer'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Env } from '@/shared/constants/environments'
import { EmailTemplate } from '@/shared/enums/email-template'
import { CartStatus, OrderStatus } from '@/shared/enums/status'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
import { formatDateTime } from '@/shared/utils/formatter'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (isAuthFailed(auth)) return auth

  try {
    const sb = await getSupabaseServerClient()
    const { data: orders, error } = await sb
      .from('orders')
      .select('*, shipment_methods!inner(code)')
      .eq('user_id', auth.sub)
      .order('creation_date', { ascending: false })

    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
        status: 500,
      })
    }

    const resPayload = orders.map(order => ({
      ...order,
      shipment_method: order.shipment_methods.code,
    }))

    return NextResponse.json(
      generateSuccessResponse(resPayload, 'Orders fetched successfully'),
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

type CartItemWithProduct = {
  id: string
  quantity: number
  product_id: string
  products: { name: string; price: number }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (isAuthFailed(auth)) return auth

  try {
    const {
      address,
      city,
      country,
      email,
      paymentMethod,
      phone,
      postalCode,
      recipientName,
      shipmentMethod,
      state,
    } = await req.json()

    const sb = await getSupabaseServerClient()
    const { data: cart } = await sb
      .from('carts')
      .select('id')
      .eq('user_id', auth.sub)
      .eq('status', 'active')
      .single()
    if (!cart) {
      return NextResponse.json(generateErrorResponse('Cart not found'), {
        status: 404,
      })
    }

    const { data: cartItemsData } = await sb
      .from('cart_items')
      .select('id, quantity, product_id, products!inner(name, price)')
      .eq('cart_id', cart.id)
    const cartItems = cartItemsData as CartItemWithProduct[] | null
    if (!cartItems) {
      return NextResponse.json(generateErrorResponse('Cart items not found'), {
        status: 404,
      })
    }

    const { data: shipmentMethodData } = await sb
      .from('shipment_methods')
      .select('fee')
      .eq('id', shipmentMethod)
      .single()
    if (!shipmentMethodData) {
      return NextResponse.json(
        generateErrorResponse('Shipment method not found'),
        {
          status: 404,
        },
      )
    }

    const { data: paymentMethodData } = await sb
      .from('payment_methods')
      .select('name, identity')
      .eq('id', paymentMethod)
      .single()
    if (!paymentMethodData) {
      return NextResponse.json(
        generateErrorResponse('Payment method not found'),
        {
          status: 404,
        },
      )
    }

    const paymentIdentity = paymentMethodData.identity
    const shipmentMethodFee = shipmentMethodData.fee
    const subtotalAmount = cartItems.reduce(
      (acc, item) => acc + item.products.price * item.quantity,
      0,
    )
    const totalAmount = subtotalAmount + shipmentMethodFee
    const orderCode = `ORD-${Date.now()}`

    const { data: newOrder, error: newOrderError } = await sb
      .from('orders')
      .insert({
        user_id: auth.sub,
        contact_info: email,
        recipient_name: recipientName,
        country,
        address,
        city,
        state,
        postal_code: postalCode,
        phone_no: phone || null,
        shipment_method_id: shipmentMethod,
        delivery_fee_snapshot: shipmentMethodFee,
        payment_method_id: paymentMethod,
        subtotal_amount: subtotalAmount,
        total_amount: totalAmount,
        status: OrderStatus.PENDING,
        code: orderCode,
        created_by: auth.sub,
      })
      .select('id, creation_date')
      .single()
    if (newOrderError) {
      return NextResponse.json(generateErrorResponse(newOrderError.message), {
        status: 500,
      })
    }

    const { error: insertOrderItemsError } = await sb
      .from('order_items')
      .insert(
        cartItems.map(item => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          product_name: item.products.name,
          quantity: item.quantity,
          price_snapshot: item.products.price,
          created_by: auth.sub,
        })),
      )
    if (insertOrderItemsError) {
      return NextResponse.json(
        generateErrorResponse(insertOrderItemsError.message),
        { status: 500 },
      )
    }

    const { error: updateCartError } = await sb
      .from('carts')
      .update({
        status: CartStatus.CONVERTED,
        updated_by: auth.sub,
        last_updated: new Date().toISOString(),
      })
      .eq('id', cart.id)
    if (updateCartError) {
      return NextResponse.json(generateErrorResponse(updateCartError.message), {
        status: 500,
      })
    }

    const { error: emailError } = await sendOrderEmail(
      email,
      'Thank you for your order',
      EmailTemplate.PAYMENT,
      {
        customerName: recipientName,
        orderNumber: orderCode,
        orderDate: formatDateTime(newOrder.creation_date),
        paymentMethod: paymentMethodData.name,
        paymentIdentity,
        orderUrl: `${Env.APP_URL}/callback?redirect_url=/orders/${newOrder.id}`,
      },
    )
    if (emailError) {
      return NextResponse.json(generateErrorResponse(emailError.message), {
        status: 500,
      })
    }

    return NextResponse.json(
      generateSuccessResponse(
        { id: newOrder.id },
        'Order created successfully',
      ),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to create order',
      ),
      { status: 500 },
    )
  }
}
