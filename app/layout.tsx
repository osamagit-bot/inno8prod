'use client'

import './globals.css'
import { Nunito } from 'next/font/google'
import Header from '@/components/Header'
import LoadingScreen from '@/components/LoadingScreen'
import CustomCursor from '@/components/CustomCursor'
import { usePathname } from 'next/navigation'
import { ColorProvider } from '@/contexts/ColorContext'

const nunito = Nunito({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideHeader = pathname === '/login' || pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <body className={`${nunito.className} cursor-none`}>
        <ColorProvider>
          <CustomCursor />
          <LoadingScreen />
          {!hideHeader && <Header />}
          {children}
        </ColorProvider>
      </body>
    </html>
  )
}