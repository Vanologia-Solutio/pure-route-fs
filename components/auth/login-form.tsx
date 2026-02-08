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
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { ComponentProps, SubmitEvent } from 'react'

export default function LoginForm({
  className,
  ...props
}: ComponentProps<'div'>) {
  const { isLoading, signIn } = useAuthStore()

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)
      const username = formData.get('username') as string
      const password = formData.get('password') as string
      const res = await signIn({ username, password })
      if (res.success) {
        window.location.href = '/shop'
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className='flex flex-col items-center gap-2 text-center'>
            <a
              href='#'
              className='flex flex-col items-center gap-2 font-medium'
            >
              <div className='flex size-16 items-center justify-center rounded-md'>
                <Image
                  src='/meta-logo.webp'
                  alt='Logo'
                  width={64}
                  height={64}
                />
              </div>
              <span className='sr-only'>Pure Route Peptides</span>
            </a>
            <h1 className='text-xl font-bold'>
              Welcome to Pure Route Peptides
            </h1>
            <FieldDescription>
              Don&apos;t have an account? <a href='/register'>Sign up</a>
            </FieldDescription>
          </div>
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
              {isLoading && <Loader2 className='size-4 animate-spin' />}
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className='px-6 text-center'>
        Log in to access more features and enjoy a personalized experience
        tailored just for you.
      </FieldDescription>
    </div>
  )
}
