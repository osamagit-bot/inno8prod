'use client'

import './globals.css'
import { Nunito } from 'next/font/google'
import Header from '@/components/Header'
import LoadingScreen from '@/components/LoadingScreen'
import CustomCursor from '@/components/CustomCursor'
import { usePathname } from 'next/navigation'
import { ColorProvider } from '@/contexts/ColorContext'
import { useEffect, useState } from 'react'
import { fetchMaintenanceStatus, API_ENDPOINTS, getImageUrl } from '@/lib/api'
import Head from 'next/head'

const nunito = Nunito({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [faviconUrl, setFaviconUrl] = useState('/images/inoo8%20With%20Bg.jpg')
  
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const data = await fetchMaintenanceStatus()
        setMaintenanceMode(data.maintenance_mode)
      } catch (error) {
        console.error('Failed to check maintenance status:', error)
      }
    }
    
    const fetchFavicon = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SITE_SETTINGS)
        if (response.ok) {
          const data = await response.json()
          if (data.mobile_logo) {
            setFaviconUrl(getImageUrl(data.mobile_logo))
          }
        }
      } catch (error) {
        console.log('Using fallback favicon')
      }
    }
    
    checkMaintenance()
    fetchFavicon()
  }, [pathname])
  
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = faviconUrl
    document.getElementsByTagName('head')[0].appendChild(link)
  }, [faviconUrl])
  
  const hideHeader = pathname === '/login' || pathname === '/login/' || pathname?.startsWith('/admin') || pathname === '/maintenance' || maintenanceMode

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconUrl} />
      </head>
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