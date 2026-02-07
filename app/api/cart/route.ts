import { getSupabaseServerClient } from '@/lib/supabase/server'
import { CartStatus } from '@/shared/enums/status'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

async function getActiveCart(sb: any, userId: string) {
  const { data: cart, error } = await sb
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  return { cart, error }
}

async function updateCartTime(sb: any, cartId: string, userId: string) {
  return await sb
    .from('carts')
    .update({
      updated_by: userId,
      last_updated: new Date().toISOString(),
    })
    .eq('id', cartId)
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const sb = await getSupabaseServerClient()
    const { data: cart } = await sb
      .from('carts')
      .select('id')
      .eq('user_id', auth.sub)
      .eq('status', 'active')
      .single()
    if (!cart) {
      return NextResponse.json(generateSuccessResponse(null, 'Cart not found'))
    }
    const {
      data: cartItems,
    }: PostgrestSingleResponse<
      {
        id: string
        quantity: number
        product_id: string
        products: {
          name: string
          description: string
          price: number
          file_path: string
        }
      }[]
    > = await sb
      .from('cart_items')
      .select('*, products!inner(name, description, price, file_path)')
      .eq('cart_id', cart.id)
      .order('product_id', { ascending: true })

    const products =
      cartItems?.map(item => ({
        id: item.product_id,
        name: item.products.name,
        description: item.products.description,
        quantity: item.quantity,
        price: item.products.price,
        file_path: item.products.file_path,
      })) || []

    return NextResponse.json(
      generateSuccessResponse(
        {
          id: cart.id,
          products,
        },
        'Cart fetched successfully',
      ),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to get cart',
      ),
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { productId, quantity } = (await req.json()) as {
      productId: string
      quantity?: number
    }
    if (!productId) {
      return NextResponse.json(generateErrorResponse('productId is required'), {
        status: 400,
      })
    }

    const qty = Number.isFinite(quantity) && quantity! > 0 ? quantity! : 1
    const sb = await getSupabaseServerClient()

    const { cart } = await getActiveCart(sb, auth.sub)
    let cartId = cart?.id

    if (!cartId) {
      const { data: newCart, error: createError } = await sb
        .from('carts')
        .insert({
          user_id: auth.sub,
          status: CartStatus.ACTIVE,
          created_by: auth.sub,
        })
        .select('id')
        .single()
      if (createError || !newCart) {
        return NextResponse.json(
          generateErrorResponse(
            createError?.message ?? 'Failed to create cart',
          ),
          { status: 500 },
        )
      }
      cartId = newCart.id
    }

    const { data: existingItems, error: existingError } = await sb
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .limit(1)

    if (existingError) {
      return NextResponse.json(generateErrorResponse(existingError.message), {
        status: 500,
      })
    }

    const existingItem = existingItems?.[0]
    if (existingItem) {
      const newQty = existingItem.quantity + qty
      const { error: updateError } = await sb
        .from('cart_items')
        .update({
          quantity: newQty,
          updated_by: auth.sub,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existingItem.id)

      if (updateError) {
        return NextResponse.json(generateErrorResponse(updateError.message), {
          status: 500,
        })
      }
    } else {
      const { error: insertError } = await sb.from('cart_items').insert({
        cart_id: cartId,
        product_id: productId,
        quantity: qty,
        created_by: auth.sub,
      })

      if (insertError) {
        return NextResponse.json(generateErrorResponse(insertError.message), {
          status: 500,
        })
      }
    }

    const { error: updateCartError } = await updateCartTime(
      sb,
      cartId,
      auth.sub,
    )
    if (updateCartError) {
      return NextResponse.json(generateErrorResponse(updateCartError.message), {
        status: 500,
      })
    }

    return NextResponse.json(
      generateSuccessResponse(null, 'Item added to cart'),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to add to cart',
      ),
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { productId, quantity } = (await req.json()) as {
      productId: string
      quantity: number
    }
    if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        generateErrorResponse('productId and quantity (>= 1) required'),
        { status: 400 },
      )
    }

    const sb = await getSupabaseServerClient()
    const { cart } = await getActiveCart(sb, auth.sub)
    if (!cart) {
      return NextResponse.json(generateErrorResponse('Cart not found'), {
        status: 404,
      })
    }

    const { error: updateItemError } = await sb
      .from('cart_items')
      .update({
        quantity,
        updated_by: auth.sub,
        last_updated: new Date().toISOString(),
      })
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
    if (updateItemError) {
      return NextResponse.json(generateErrorResponse(updateItemError.message), {
        status: 500,
      })
    }

    const { error: updateCartError } = await updateCartTime(
      sb,
      cart.id,
      auth.sub,
    )
    if (updateCartError) {
      return NextResponse.json(generateErrorResponse(updateCartError.message), {
        status: 500,
      })
    }

    return NextResponse.json(generateSuccessResponse(null, 'Cart item updated'))
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to update cart',
      ),
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) return auth

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    if (!productId) {
      return NextResponse.json(
        generateErrorResponse('productId query param required'),
        { status: 400 },
      )
    }

    const sb = await getSupabaseServerClient()
    const { cart } = await getActiveCart(sb, auth.sub)
    if (!cart) {
      return NextResponse.json(generateErrorResponse('Cart not found'), {
        status: 404,
      })
    }

    const { error: deleteItemError } = await sb
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
    if (deleteItemError) {
      return NextResponse.json(generateErrorResponse(deleteItemError.message), {
        status: 500,
      })
    }

    const { error: updateCartError } = await updateCartTime(
      sb,
      cart.id,
      auth.sub,
    )
    if (updateCartError) {
      return NextResponse.json(generateErrorResponse(updateCartError.message), {
        status: 500,
      })
    }

    return NextResponse.json(generateSuccessResponse(null, 'Cart item removed'))
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Failed to remove from cart',
      ),
      { status: 500 },
    )
  }
}
