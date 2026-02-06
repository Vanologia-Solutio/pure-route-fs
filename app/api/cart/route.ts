import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import { isAuthFailed, requireAuth } from '@/shared/utils/auth'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req)
    if (isAuthFailed(auth)) {
      return auth
    }

    const sb = await getSupabaseServerClient()

    const { data: cart } = await sb
      .from('carts')
      .select('*')
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
          price: number
        }
      }[]
    > = await sb
      .from('cart_items')
      .select('*, products!inner(name, price)')
      .eq('cart_id', cart.id)

    return NextResponse.json(
      generateSuccessResponse(
        {
          id: cart.id,
          products:
            cartItems?.map(item => ({
              id: item.product_id,
              name: item.products.name,
              quantity: item.quantity,
              price: item.products.price,
            })) ?? [],
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

    const body = await req.json()
    const { productId, quantity } = body as {
      productId: string
      quantity?: number
    }

    if (!productId) {
      return NextResponse.json(generateErrorResponse('productId is required'), {
        status: 400,
      })
    }

    const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 1

    const sb = await getSupabaseServerClient()

    // Find or create active cart for this user
    const { data: carts, error: cartsError } = await sb
      .from('carts')
      .select('id')
      .eq('user_id', auth.sub)
      .eq('status', 'active')
      .limit(1)

    if (cartsError) {
      return NextResponse.json(generateErrorResponse(cartsError.message), {
        status: 500,
      })
    }

    let cartId = carts?.[0]?.id as string | undefined

    if (!cartId) {
      const { data: newCart, error: createError } = await sb
        .from('carts')
        .insert({ user_id: auth.sub, status: 'active' })
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

      cartId = newCart.id as string
    }

    // Check if item already exists in cart
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
        .update({ quantity: newQty })
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
      })

      if (insertError) {
        return NextResponse.json(generateErrorResponse(insertError.message), {
          status: 500,
        })
      }
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

    const body = await req.json()
    const { productId, quantity } = body as {
      productId: string
      quantity: number
    }
    if (productId == null || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        generateErrorResponse('productId and quantity (>= 1) required'),
        { status: 400 },
      )
    }

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

    const { error } = await sb
      .from('cart_items')
      .update({ quantity })
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
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

    const { error } = await sb
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', productId)

    if (error) {
      return NextResponse.json(generateErrorResponse(error.message), {
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
