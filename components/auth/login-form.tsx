import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ComponentProps } from 'react'

export default function LoginForm({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form>
        <FieldGroup>
          <div className='flex flex-col items-center gap-2 text-center'>
            <a
              href='#'
              className='flex flex-col items-center gap-2 font-medium'
            >
              <div className='flex size-16 items-center justify-center rounded-md'>
                <Image src='/meta-logo.png' alt='Logo' width={64} height={64} />
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
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <Input
              id='password'
              type='password'
              placeholder='********'
              required
            />
          </Field>
          <Field>
            <Button type='submit'>Login</Button>
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
