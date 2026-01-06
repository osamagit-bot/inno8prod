'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'

export default function CustomCursor() {
  const colors = useColors()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    document.addEventListener('mousemove', updateMousePosition)
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          transform: `scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        <div
          className="w-5 h-5 rounded-full border-2 transition-all duration-200"
          style={{
            borderColor: colors.accent_color,
            backgroundColor: isHovering ? `${colors.accent_color}20` : 'transparent',
          }}
        />
      </div>
      
      {/* Trailing dot */}
      <div
        className="fixed pointer-events-none z-40 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 2,
          top: mousePosition.y - 2,
        }}
      >
        <div
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: colors.primary_color }}
        />
      </div>
    </>
  )
}