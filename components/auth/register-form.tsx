'use client'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/shared/stores/auth-store'
import { Loader2, UserPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentProps, SubmitEvent } from 'react'

export default function RegisterForm({
  className,
  ...props
}: ComponentProps<'div'>) {
  const { register, isLoading } = useAuthStore()

  const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get('name') as string
      const username = formData.get('username') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const res = await register({
        name,
        username,
        email,
        password,
      })
      if (res.success) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleRegister}>
        <FieldGroup>
          <div className='flex flex-col items-center gap-2 text-center'>
            <a
              href='#'
              className='flex flex-col items-center gap-2 font-medium'
            >
              <div className='flex size-16 items-center justify-center rounded-md'>
                <Image
                  src='https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/general/meta-logo.webp'
                  alt='Logo'
                  width={64}
                  height={64}
                />
              </div>
              <span className='sr-only'>Pure Route Peptides</span>
            </a>
            <h1 className='text-xl font-bold'>
              Create an account to get started
            </h1>
            <FieldDescription>
              Already have an account? <Link href='/login'>Log in</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor='name'>Name</FieldLabel>
            <Input
              name='name'
              id='name'
              type='text'
              placeholder='John Doe'
              disabled={isLoading}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='username'>Username</FieldLabel>
            <Input
              name='username'
              id='username'
              type='text'
              placeholder='john.doe'
              disabled={isLoading}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='email'>Email (optional)</FieldLabel>
            <Input
              name='email'
              id='email'
              type='email'
              placeholder='john.doe@example.com'
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <Input
              name='password'
              id='password'
              type='password'
              placeholder='********'
              minLength={8}
              required
              disabled={isLoading}
            />
          </Field>
          <Field>
            <Button
              className='bg-green-700 text-white hover:bg-green-800'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <UserPlus className='size-4' />
              )}
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className='px-6 text-center'>
        Register to access more features and enjoy a personalized experience
        tailored just for you.
      </FieldDescription>
    </div>
  )
}
