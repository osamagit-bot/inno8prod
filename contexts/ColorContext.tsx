'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ColorPalette {
  primary_color: string
  secondary_color: string
  accent_color: string
  light_color: string
}

const ColorContext = createContext<ColorPalette>({
  primary_color: '#0477BF',
  secondary_color: '#012340',
  accent_color: '#FCB316',
  light_color: '#048ABF'
})

export const useColors = () => useContext(ColorContext)

export function ColorProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ColorPalette>({
    primary_color: '#0477BF',
    secondary_color: '#012340',
    accent_color: '#FCB316',
    light_color: '#048ABF'
  })

  const validateHexColor = (color: string): string => {
    if (!color || !color.startsWith('#')) return '#000000'
    const hex = color.slice(1)
    if (hex.length === 6 && /^[0-9A-Fa-f]{6}$/.test(hex)) return color
    if (hex.length === 3 && /^[0-9A-Fa-f]{3}$/.test(hex)) {
      return '#' + hex.split('').map(c => c + c).join('')
    }
    return '#000000'
  }

  useEffect(() => {
    fetch(API_ENDPOINTS.COLOR_PALETTE)
      .then(res => res.json())
      .then(data => {
        setColors({
          primary_color: validateHexColor(data.primary_color),
          secondary_color: validateHexColor(data.secondary_color),
          accent_color: validateHexColor(data.accent_color),
          light_color: validateHexColor(data.light_color)
        })
      })
      .catch(() => console.log('Using default colors'))
  }, [])

  return (
    <ColorContext.Provider value={colors}>
      {children}
    </ColorContext.Provider>
  )
}