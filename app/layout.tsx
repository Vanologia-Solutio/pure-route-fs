import Footer from '@/components/general/footer'
import NavigationBar from '@/components/general/navigation-bar'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
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
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-secondary to-background`}
      >
        <NavigationBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
