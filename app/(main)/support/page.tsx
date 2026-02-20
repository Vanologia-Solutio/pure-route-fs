import { Fragment } from 'react'

export default function SupportPage() {
  return (
    <Fragment>
      <h1 className='text-2xl font-bold mb-4 md:text-3xl'>Support</h1>
      <p className='text-muted-foreground'>
        If you have any questions or need assistance, please contact us at
      </p>
      <a
        href='mailto:pureroutepeps@proton.me'
        className='text-green-700 hover:text-green-800 hover:underline'
      >
        pureroutepeps@proton.me
      </a>
    </Fragment>
  )
}
