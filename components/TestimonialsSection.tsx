'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'

export default function TestimonialsSection() {
  const colors = useColors()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

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

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'CEO, TechStart Inc.',
      content: 'Inno8 transformed our digital presence completely. Their innovative approach and attention to detail exceeded our expectations. The team delivered a solution that not only met our requirements but also enhanced our business operations significantly.',
      rating: 5,
      avatar: '/images/avatar1.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'CTO, Digital Solutions',
      content: 'Working with Inno8 was an exceptional experience. Their technical expertise and professional approach made our complex project seem effortless. The results speak for themselves - increased efficiency and improved user engagement.',
      rating: 5,
      avatar: '/images/avatar2.jpg'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Marketing Director, GrowthCorp',
      content: 'The team at Inno8 delivered beyond our expectations. Their creative solutions and timely delivery helped us launch our product successfully. I highly recommend them for any software development needs.',
      rating: 5,
      avatar: '/images/avatar3.jpg'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className="py-20" style={{ backgroundColor: colors.secondary_color }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 rounded-full mr-4" style={{ backgroundColor: colors.primary_color }}></div>
            <span className="text-lg font-medium text-white">
              Client Testimonials
            </span>
            <div className="w-12 h-1 rounded-full ml-4" style={{ backgroundColor: colors.primary_color }}></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            What Our <span style={{ color: colors.primary_color }}>Clients Say</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about our services.
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
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-lg text-black">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-800">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
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