import { Fragment } from 'react'

export default function SupportPage() {
  return (
    <Fragment>
      <h1 className='text-3xl font-bold mb-6'>Support</h1>
      <p className='text-gray-500'>
        If you have any questions or need assistance, please contact us at
      </p>
      <a
        href='mailto:pureroutepeptides@proton.me'
        className='text-green-700 hover:text-green-800 hover:underline'
      >
        pureroutepeptides@proton.me
      </a>
    </Fragment>
  )
}
