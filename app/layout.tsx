'use client'

import './globals.css'
import { Nunito } from 'next/font/google'
import Header from '@/components/Header'
import LoadingScreen from '@/components/LoadingScreen'
import CustomCursor from '@/components/CustomCursor'
import { usePathname } from 'next/navigation'
import { ColorProvider } from '@/contexts/ColorContext'
import { useEffect, useState } from 'react'
import { fetchMaintenanceStatus } from '@/lib/api'

const nunito = Nunito({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const data = await fetchMaintenanceStatus()
        setMaintenanceMode(data.maintenance_mode)
      } catch (error) {
        console.error('Failed to check maintenance status:', error)
      }
    }
    checkMaintenance()
  }, [pathname])
  
  const hideHeader = pathname === '/login' || pathname === '/login/' || pathname?.startsWith('/admin') || pathname === '/maintenance' || maintenanceMode

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