import Footer from '@/components/general/footer'
import NavigationBar from '@/components/general/navigation-bar'
import ClientProvider from '@/shared/providers/client-provider'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Pure Route Peptides',
  description: 'Pure Route Peptides',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <NavigationBar />
          <main className='max-w-6xl mx-auto min-h-[calc(100vh-120px)] px-4'>
            <div className='py-8'>{children}</div>
          </main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  )
}
