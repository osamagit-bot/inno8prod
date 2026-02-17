'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function usePageTracking() {
  const pathname = usePathname()
  const tracked = useRef(new Set<string>())

  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin') && !pathname.startsWith('/login') && !tracked.current.has(pathname)) {
      tracked.current.add(pathname)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
      fetch(`${apiUrl}/api/analytics/track/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer
        })
      }).catch(() => {})
    }
  }, [pathname])
}
