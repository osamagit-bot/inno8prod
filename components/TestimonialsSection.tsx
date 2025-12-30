'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS } from '../lib/api'
import { fallbackData } from '../lib/fallbackData'

interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  content: string
  rating: number
  order: number
  is_active: boolean
}

interface SectionData {
  subtitle: string
  title: string
  description: string
}

export default function TestimonialsSection() {
  const colors = useColors()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackData.testimonials)
  const [sectionData, setSectionData] = useState<SectionData>(fallbackData.testimonialsSection)

  useEffect(() => {
    fetchTestimonialsData()
    fetchSectionData()
  }, [])

  const fetchTestimonialsData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TESTIMONIALS)
      if (response.ok) {
        const data = await response.json()
        const activeTestimonials = data.filter((testimonial: Testimonial) => testimonial.is_active).sort((a: Testimonial, b: Testimonial) => a.order - b.order)
        if (activeTestimonials.length > 0) {
          setTestimonials(activeTestimonials)
        }
      }
    } catch (error) {
      console.log('Backend offline - using fallback testimonials data')
      setTestimonials(fallbackData.testimonials)
    }
  }

  const fetchSectionData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TESTIMONIALS_SECTION)
      if (response.ok) {
        const data = await response.json()
        setSectionData({
          subtitle: data.subtitle || sectionData.subtitle,
          title: data.title || sectionData.title,
          description: data.description || sectionData.description
        })
      }
    } catch (error) {
      console.log('Backend offline - using fallback section data')
      setSectionData(fallbackData.testimonialsSection)
    }
  }



  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const endX = e.clientX
    const diff = startX - endX
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length)
      } else {
        setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diff = startX - endX
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length)
      } else {
        setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={`star-${index}`}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section id="testimonials" className="py-20" style={{ backgroundColor: colors.secondary_color, scrollMarginTop: '100px' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
            <span className="text-gray-300 uppercase tracking-wider text-sm">
              {sectionData.subtitle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {sectionData.title.split(' ').map((word, index) => 
              word === 'Clients' || word === 'Say' ? (
                <span key={`title-${word}-${index}`} style={{ color: colors.primary_color }}>{word} </span>
              ) : (
                <span key={`title-${word}-${index}`}>{word} </span>
              )
            )}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'opacity-100' 
                    : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="rounded-md p-8 md:p-12 shadow-lg relative overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
                  {/* Animated Background */}
                  <div className={`absolute inset-0 rounded-md transform transition-transform duration-1000 ease-out ${
                    index === activeTestimonial ? 'scale-100' : 'scale-0'
                  }`} style={{ backgroundColor: colors.primary_color, opacity: 0.1 }}></div>
                  {/* Quote Icon */}
                  <div className="absolute top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary_color + '20' }}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary_color }}>
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="pt-8">
                    {/* Rating */}
                    <div className="flex justify-center mb-6">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-lg text-black leading-relaxed text-center mb-8 italic">
                      "{testimonial.content}"
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4" style={{ borderColor: colors.primary_color }}>
                        <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: colors.primary_color }}>
                          {testimonial.name.split(' ').map((n, nameIndex) => n[0]).join('')}
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-lg text-black">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-800">{testimonial.position}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? 'scale-125' : 'scale-100'
                }`}
                style={{ 
                  backgroundColor: index === activeTestimonial ? colors.primary_color : colors.accent_color,
                  opacity: index === activeTestimonial ? 1 : 0.5
                }}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: colors.primary_color }}
              onClick={() => setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: colors.primary_color }}
              onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}