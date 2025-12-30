'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'
import { fallbackData } from '../lib/fallbackData'

interface HeroContent {
  id?: number
  title: string
  subtitle: string
  description: string
  buttonText: string
  backgroundImage: string
  order?: number
}

export default function HeroSection() {
  const colors = useColors()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [heroContents, setHeroContents] = useState<HeroContent[]>([
    {
      title: fallbackData.heroSections[0].title,
      subtitle: fallbackData.heroSections[0].subtitle,
      description: fallbackData.heroSections[0].description,
      buttonText: fallbackData.heroSections[0].button_text,
      backgroundImage: fallbackData.heroSections[0].background_image
    }
  ])

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HERO_SECTIONS)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const formattedData = data.map(item => ({
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            buttonText: item.buttonText || item.button_text,
            backgroundImage: getImageUrl(item.background_image)
          }))
          setHeroContents(formattedData)
        }
      }
    } catch (error) {
      console.log('Backend offline - using fallback hero content')
      setHeroContents([
        {
          title: fallbackData.heroSections[0].title,
          subtitle: fallbackData.heroSections[0].subtitle,
          description: fallbackData.heroSections[0].description,
          buttonText: fallbackData.heroSections[0].button_text,
          backgroundImage: fallbackData.heroSections[0].background_image
        }
      ])
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroContents.length)
        setIsAnimating(false)
      }, 800)
    }, 6000)

    return () => clearInterval(interval)
  }, [heroContents.length])

  if (heroContents.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Loading Hero Content...</h1>
          <p className="text-lg">Please wait while we load the content.</p>
        </div>
      </section>
    )
  }

  const currentContent = heroContents[currentSlide]

  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        key={currentSlide}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 z-0 animate-zoom-in"
        style={{ backgroundImage: `url(${currentContent.backgroundImage})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
      
      {/* Blue Overlay Animation */}
      <div className={`absolute inset-0 bg-opacity-90 transform transition-transform duration-1500 ease-out z-0 ${
        isAnimating ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ backgroundColor: colors.primary_color }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
          <h2 className="text-lg md:text-xl font-medium mb-4 animate-fade-in" style={{ color: colors.accent_color }}>
            {currentContent.subtitle}
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {currentContent.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            {currentContent.description}
          </p>
          <button className="relative px-8 py-4 rounded-sm font-medium text-lg shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-300" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
            <span className="relative z-10 group-hover:text-white transition-colors">
              {currentContent.buttonText}
            </span>
            <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
          </button>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroContents.map((_, index) => (
          <button
            key={`slide-${index}`}
            onClick={() => {
              setIsAnimating(true)
              setTimeout(() => {
                setCurrentSlide(index)
                setIsAnimating(false)
              }, 400)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            style={index === currentSlide ? { backgroundColor: colors.accent_color } : {}}
          />
        ))}
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      
      
    </section>
  )
}