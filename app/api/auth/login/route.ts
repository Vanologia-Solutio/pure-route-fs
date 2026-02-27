import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Env } from '@/shared/constants/environments'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const sb = await getSupabaseServerClient()

    const { data: user } = await sb
      .from('users')
      .select(
        'id, name, username, email, role_id, roles!inner(id, code), password',
      )
      .eq('username', username)
      .eq('is_active', true)
      .single()
    if (!user) {
      return NextResponse.json(generateErrorResponse('Invalid credentials'), {
        status: 401,
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(generateErrorResponse('Invalid credentials'), {
        status: 401,
      })
    }

    const { data: responsibilities } = await sb
      .from('responsibilities')
      .select(`id, menus!inner(id, url, is_active)`)
      .eq('role_id', user.role_id)
      .eq('menus.is_public', false)
      .eq('menus.is_active', true)

    const roleCode = (user.roles as any)?.code
    const perms = responsibilities?.map(r => (r.menus as any).url) ?? []

    const jwtPayload = {
      sub: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      attrs: {
        role: roleCode,
      },
      perms,
    }

    const token = jwt.sign(jwtPayload, Env.JWT_SECRET, { expiresIn: '1d' })
    return NextResponse.json(
      generateSuccessResponse<{ token: string }>({ token }, 'Login successful'),
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Error logging in',
      ),
    )
  }
}
