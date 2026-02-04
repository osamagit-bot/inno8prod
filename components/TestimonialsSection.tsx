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

interface ReviewFormData {
  name: string
  position: string
  company: string
  content: string
  rating: number
}

export default function TestimonialsSection() {
  const colors = useColors()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackData.testimonials)
  const [sectionData, setSectionData] = useState<SectionData>(fallbackData.testimonialsSection)
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5
  })

  useEffect(() => {
    fetchTestimonialsData()
    fetchSectionData()
    
    // Initialize AOS
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
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

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      errors.name = 'Name should only contain letters and spaces'
    }
    
    if (!formData.position.trim()) errors.position = 'Position is required'
    if (!formData.company.trim()) errors.company = 'Company is required'
    if (!formData.content.trim()) errors.content = 'Review content is required'
    if (formData.content.trim().length < 10) errors.content = 'Review must be at least 10 characters'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowModal(false)
      setIsClosing(false)
      setSubmitMessage('')
    }, 300)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch(API_ENDPOINTS.TESTIMONIAL_SUBMIT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setSubmitMessage('Thank you! Your review has been submitted and will be published after approval. This typically takes 24 hours.')
        setFormData({ name: '', position: '', company: '', content: '', rating: 5 })
        setFormErrors({})
        
        setTimeout(() => {
          const messageElement = document.querySelector('.success-message')
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      } else {
        setSubmitMessage('Error submitting review. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Error submitting review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time validation
    const errors = { ...formErrors }
    
    if (name === 'name') {
      if (!value.trim()) {
        errors.name = 'Name is required'
      } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
        errors.name = 'Name should only contain letters and spaces'
      } else {
        delete errors.name
      }
    }
    
    if (name === 'position') {
      if (!value.trim()) {
        errors.position = 'Position is required'
      } else {
        delete errors.position
      }
    }
    
    if (name === 'company') {
      if (!value.trim()) {
        errors.company = 'Company is required'
      } else {
        delete errors.company
      }
    }
    
    if (name === 'content') {
      if (!value.trim()) {
        errors.content = 'Review content is required'
      } else if (value.trim().length < 10) {
        errors.content = 'Review must be at least 10 characters'
      } else {
        delete errors.content
      }
    }
    
    setFormErrors(errors)
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
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
    <section id="testimonials" className="py-20" style={{ backgroundColor: colors.primary_color, scrollMarginTop: '100px' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
            <span className="text-gray-300 uppercase tracking-wider text-sm">
              {sectionData.subtitle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-aos="fade-up" data-aos-delay="200">
            {sectionData.title.split(' ').map((word, index) => 
              word === 'Clients' || word === 'Say' ? (
                <span key={`title-${word}-${index}`} style={{color: colors.accent_color }}>{word} </span>
              ) : (
                <span key={`title-${word}-${index}`}>{word} </span>
              )
            )}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="400">
            {sectionData.description}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="600">
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

          {/* Submit Review Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="relative px-6 py-3 rounded-sm font-medium shadow-sm overflow-hidden group"
              style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}
            >
              <span className="relative z-10 group-hover:text-white transition-colors">Submit Your Review</span>
              <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
            </button>
          </div>
        </div>

        {/* Review Submission Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className={`bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
                isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
              }`}
              style={{ animation: !isClosing ? 'fadeIn 0.3s ease-out' : '' }}
            >
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-2xl font-bold" style={{ color: colors.secondary_color }}>
                  Submit Your Review
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {submitMessage && (
                <div className={`success-message p-4 rounded-lg mb-4 ${
                  submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.position ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.position && <p className="text-red-500 text-sm mt-1">{formErrors.position}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.company ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.company && <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating *
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className={`w-8 h-8 ${
                          star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                      formErrors.content ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Share your experience with us..."
                  />
                  {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your review will be shown on the website after approval by our team.
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50"
                    style={{ backgroundColor: colors.primary_color }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.9); }
        }
      `}</style>
    </section>
  )
}