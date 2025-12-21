'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'
import { ColorProvider } from '@/contexts/ColorContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideHeader = pathname === '/login' || pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorProvider>
          {!hideHeader && <Header />}
          {children}
        </ColorProvider>
      </body>
    </html>
  )
}