import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '@/shared/helpers/api-response'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, password } = await req.json()
    if (!name || !username || !password) {
      return NextResponse.json(
        generateErrorResponse('Missing required fields'),
        { status: 400 },
      )
    }

    if (email && !email.includes('@')) {
      return NextResponse.json(generateErrorResponse('Invalid email address'), {
        status: 400,
      })
    }

    const sb = await getSupabaseServerClient()

    const { data: existingUser } = await sb
      .from('users')
      .select('id')
      .or(`username.eq.${username}, email.eq.${email}`)
      .maybeSingle()
    if (existingUser) {
      return NextResponse.json(generateErrorResponse('User already exists'), {
        status: 400,
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const { data: createdUser, error: createErr } = await sb
      .from('users')
      .insert({
        name: name.trim(),
        username: username.trim(),
        email: email?.trim() || null,
        password: passwordHash,
      })
      .select('id, name, username, email')
      .single()
    if (createErr) {
      return NextResponse.json(generateErrorResponse(createErr.message), {
        status: 500,
      })
    }

    return NextResponse.json(
      generateSuccessResponse<{ id: string }>(
        { id: createdUser.id },
        'Register successful',
      ),
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      generateErrorResponse(
        error instanceof Error ? error.message : 'Error registering',
      ),
    )
  }
}
