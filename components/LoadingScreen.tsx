'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'

export default function LoadingScreen() {
  const colors = useColors()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: colors.secondary_color }}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: colors.accent_color, borderTopColor: 'transparent' }}></div>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.accent_color }}>INNO8</h1>
        <p className="text-lg" style={{ color: colors.primary_color }}>Loading...</p>
      </div>
    </div>
  )
}