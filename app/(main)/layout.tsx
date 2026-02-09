import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className='max-w-6xl mx-auto min-h-[calc(100vh-120px)] px-2.5 sm:px-4'>
      <div className='py-6 sm:py-8'>{children}</div>
    </main>
  )
}
