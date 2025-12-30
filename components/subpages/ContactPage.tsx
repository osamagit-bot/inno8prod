'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useColors } from '../../contexts/ColorContext'
import { API_ENDPOINTS } from '../../lib/api'
import Footer from '../Footer'

interface ContactInfo {
  id: number
  title: string
  value: string
  icon_svg: string
  order: number
  is_active: boolean
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const colors = useColors()
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    address: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [validFields, setValidFields] = useState<{[key: string]: boolean}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_INFO)
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data)
      } else {
        setDefaultContactInfo()
      }
    } catch (error) {
      setDefaultContactInfo()
    }
  }

  const setDefaultContactInfo = () => {
    setContactInfo([
      {
        id: 1,
        title: 'Call Us',
        value: '+1 (555) 123-4567',
        icon_svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>',
        order: 1,
        is_active: true
      },
      {
        id: 2,
        title: 'Send E-Mail',
        value: 'info@inno8.com',
        icon_svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
        order: 2,
        is_active: true
      },
      {
        id: 3,
        title: 'Office Hours',
        value: '9:00 AM to 6:00 PM',
        icon_svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        order: 3,
        is_active: true
      },
      {
        id: 4,
        title: 'Visit Office',
        value: '123 Innovation Street, Tech District, TD 12345',
        icon_svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
        order: 4,
        is_active: true
      }
    ])
  }

  const parseIconSvg = (svgString: string) => {
    return svgString
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/className=/g, 'class=')
      .replace(/strokeLinecap=/g, 'stroke-linecap=')
      .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
      .replace(/strokeWidth=/g, 'stroke-width=')
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }

    // Mark field as valid if it passes validation
    const isValid = validateField(name, value)
    setValidFields(prev => ({
      ...prev,
      [name]: isValid
    }))
  }

  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case 'name':
        return value.trim().length >= 2
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case 'phone':
        return !value || /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(value.replace(/\s/g, ''))
      case 'message':
        return value.trim().length >= 10
      default:
        return true
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_SUBMIT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowSuccessModal(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          address: ''
        })
        setValidFields({})
      } else {
        const errorData = await response.json()
        alert('Failed to send message. Please try again.')
        console.error('Error:', errorData)
      }
    } catch (error) {
      alert('Failed to send message. Please check your connection and try again.')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/abouthero.jpg"
            alt="Contact Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Blue Overlay - Left to Right Gradient */}
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(90deg, ${colors.primary_color} 0%, ${colors.primary_color}E6 40%, ${colors.primary_color}30 100%)`
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              CONTACT US
            </h1>
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">
                HOME
              </a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">CONTACT US</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Contact Inno8 Section */}
      <section id="contact-form" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
              <span className="text-gray-500 uppercase tracking-wider text-sm">GET IN TOUCH</span>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.primary_color }}>
              Contact Inno8
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ready to transform your business with innovative technology solutions? Let's discuss your project and bring your vision to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Inquiry Form */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Write to Us Anytime
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-4 border rounded-none focus:ring-0 focus:border-gray-300 transition-colors text-gray-600 ${
                        errors.name ? 'border-red-500 bg-red-50' : 
                        validFields.name ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      placeholder="Your Name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-4 border rounded-none focus:ring-0 focus:border-gray-300 transition-colors text-gray-600 ${
                        errors.email ? 'border-red-500 bg-red-50' : 
                        validFields.email ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter E-Mail"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border rounded-none focus:ring-0 focus:border-gray-300 transition-colors text-gray-600 ${
                        errors.phone ? 'border-red-500 bg-red-50' : 
                        validFields.phone ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      placeholder="Phone Number (e.g., +1 234 567 8900)"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-none focus:ring-0 focus:border-gray-300 transition-colors text-gray-600 bg-white"
                    >
                      <option value="">Subject (Optional)</option>
                      <option value="general">General Inquiry</option>
                      <option value="project">Project Discussion</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>
                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-4 border rounded-none focus:ring-0 focus:border-gray-300 transition-colors resize-none text-gray-600 ${
                      errors.message ? 'border-red-500 bg-red-50' : 
                      validFields.message ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    placeholder="Write Message (minimum 10 characters)"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`relative px-8 py-4 text-white font-semibold rounded-none overflow-hidden group transition-all ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  style={{ backgroundColor: colors.primary_color }}
                >
                  <span className="relative z-10 group-hover:text-blue-600 transition-colors flex items-center">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </span>
                  {!isSubmitting && (
                    <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out bg-[#FAFAFA]"></div>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="rounded-lg p-8 text-white" style={{ backgroundColor: colors.primary_color }}>
              <h3 className="text-2xl font-bold mb-8">
                Don't Forget to Contact Us
              </h3>
              <div className="space-y-8">
                {contactInfo.filter(info => info.is_active).sort((a, b) => a.order - b.order).map((info) => (
                  <div key={info.id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center flex-shrink-0 relative overflow-hidden group cursor-pointer">
                      <div className="text-white relative z-10 group-hover:text-blue-600 transition-colors" dangerouslySetInnerHTML={{ __html: parseIconSvg(info.icon_svg) }} />
                      <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out bg-[#FAFAFA]"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                      <p className="text-white/90 text-lg">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Integration */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary_color }}>
              Find Us on Map
            </h3>
            <p className="text-gray-600">
              Visit our office or get directions to our location
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635959552516!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-300 ease-out"
            style={{ opacity: showSuccessModal ? 0.5 : 0 }}
            onClick={closeSuccessModal}
          ></div>
          
          {/* Modal */}
          <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out ${
            showSuccessModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="p-6 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" style={{ backgroundColor: `${colors.primary_color}20` }}>
                <svg className="h-8 w-8" style={{ color: colors.primary_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for contacting us. We have received your message and will get back to you within 24 hours.
              </p>
              
              {/* Close Button */}
              <button
                onClick={closeSuccessModal}
                className="w-full px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-200"
                style={{ backgroundColor: colors.primary_color }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary_color}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary_color}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}