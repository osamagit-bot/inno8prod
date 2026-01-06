'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])
  const [heroContents, setHeroContents] = useState<HeroContent[]>([
    {
      title: fallbackData.heroSections[0].title,
      subtitle: fallbackData.heroSections[0].subtitle,
      description: fallbackData.heroSections[0].description,
      buttonText: fallbackData.heroSections[0].button_text,
      backgroundImage: fallbackData.heroSections[0].background_image
    }
  ])

  const typingWords = ['Innovation', 'Excellence', 'Technology', 'Solutions']

  useEffect(() => {
    fetchHeroContent()
    // Generate particles on client side only
    setParticles(Array.from({ length: 50 }, (_, i) => ({ 
      id: i, 
      x: Math.random() * 100, 
      y: Math.random() * 100, 
      delay: Math.random() * 2 
    })))
  }, [])

  // Smooth reveal animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % typingWords.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const fetchHeroContent = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HERO_SECTIONS)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const formattedData = data.map((item: any) => ({
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Background Image with Parallax */}
      <motion.div 
        key={currentSlide}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentContent.backgroundImage})` }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-10" />
      
      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 z-20">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 border-2 border-inno8-orange opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-24 h-24 bg-inno8-light-blue opacity-10 rounded-full"
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
      
      {/* Lightning Swipe Effect */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 z-45 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(90deg, transparent 0%, ${colors.primary_color}40 20%, ${colors.primary_color} 50%, ${colors.primary_color}40 80%, transparent 100%)`,
                filter: 'blur(1px)'
              }}
              initial={{ x: "-100%", scaleX: 0.3 }}
              animate={{ x: "100%", scaleX: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(90deg, transparent 30%, white 50%, transparent 70%)`,
                opacity: 0.6
              }}
              initial={{ x: "-100%", scaleX: 0.1 }}
              animate={{ x: "100%", scaleX: [0.1, 0.8, 0.1] }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-40 container mx-auto px-4 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Animated Subtitle */}
            <motion.h2 
              className="text-lg md:text-xl font-medium mb-4"
              style={{ color: colors.accent_color }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {currentContent.subtitle}
            </motion.h2>
            
            {/* Main Title with Split Animation */}
            <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              >
                {currentContent.title.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Reveal Animation */}
            <motion.div 
              className="text-2xl md:text-3xl font-semibold mb-6 h-12 flex items-center justify-center"
              style={{ color: colors.accent_color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Delivering 
              <div className="ml-2 relative overflow-hidden inline-block w-48 h-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWordIndex}
                    className="absolute inset-0 flex items-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Background sweep */}
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: colors.primary_color }}
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: [0, 1, 0] }}
                      transition={{ duration: 1.2, times: [0, 0.5, 1] }}
                    />
                    <motion.span 
                      className="relative z-10 text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      {typingWords[currentWordIndex]}
                    </motion.span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {currentContent.description}
            </motion.p>
            
            {/* Animated Button */}
            <motion.button 
              className="relative px-6 py-3 rounded-sm font-medium shadow-sm overflow-hidden group"
              style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 group-hover:text-white transition-colors">
                {currentContent.buttonText}
              </span>
              <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
            </motion.button>
          </motion.div>
        </AnimatePresence>
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