import { sendEmail } from '@/lib/mailer'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { CartStatus, OrderStatus } from '@/shared/enums/status'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
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

    const shipmentMethodFee = shipmentMethodData.fee
    const subtotalAmount = cartItems.reduce(
      (acc, item) => acc + item.products.price * item.quantity,
      0,
    )
    const totalAmount = subtotalAmount + shipmentMethodFee

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
        payment_method: paymentMethod,
        subtotal_amount: subtotalAmount,
        total_amount: totalAmount,
        status: OrderStatus.PENDING,
        code: `ORD-${Date.now()}`,
        created_by: auth.sub,
      })
      .select('id')
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

    sendEmail(
      email,
      'Order Created',
      `
        <h1>Order Created</h1>
        <p>Your order has been created successfully.</p>
        <p>Order ID: ${newOrder.id}</p>
        <p>Order Date: ${new Date().toISOString()}</p>
        <p>Order Total: ${totalAmount}</p>
        <p>Order Status: ${OrderStatus.PENDING}</p>
        <p>Order Items: ${cartItems.map(item => `${item.products.name} - ${item.products.price} - ${item.quantity}`).join(', ')}</p>
      `,
    )

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
