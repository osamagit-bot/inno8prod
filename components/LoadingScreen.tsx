'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'

export default function LoadingScreen() {
  const colors = useColors()
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <>
      {/* Top Half */}
      <div className={`fixed inset-0 z-50 flex items-end justify-center ${
        isExiting ? 'animate-splitUp' : ''
      }`} style={{ backgroundColor: colors.secondary_color, height: '50vh' }}>
        <div className="text-center pb-4">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: colors.accent_color, borderTopColor: 'transparent' }}></div>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: colors.accent_color }}>INNO8</h1>
        </div>
      </div>
      
      {/* Bottom Half */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 flex items-start justify-center ${
        isExiting ? 'animate-splitDown' : ''
      }`} style={{ backgroundColor: colors.secondary_color, height: '50vh' }}>
        <div className="text-center pt-4">
          <p className="text-lg" style={{ color: colors.primary_color }}>Loading...</p>
        </div>
      </div>
    </>
  )
}