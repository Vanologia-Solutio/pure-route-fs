import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className='max-w-6xl mx-auto min-h-[calc(100vh-120px)] px-4'>
      <div className='py-8'>{children}</div>
    </main>
  )
}
