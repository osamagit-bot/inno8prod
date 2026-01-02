'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import { useColors } from '../../contexts/ColorContext'
import { API_ENDPOINTS } from '../../lib/api'
import { fallbackData } from '../../lib/fallbackData'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  icon_svg?: string
  order: number
}

export default function ServicesPage() {
  const colors = useColors()
  const [services, setServices] = useState<Service[]>(fallbackData.services)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  const fetchServices = async () => {
    try {
      console.log('Fetching services from:', API_ENDPOINTS.SERVICES)
      const response = await fetch(API_ENDPOINTS.SERVICES)
      console.log('Services response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Services data:', data)
        setServices(data)
      } else {
        console.error('Failed to fetch services, status:', response.status)
      }
    } catch (error) {
      console.log('Backend offline - using fallback services')
      setServices(fallbackData.services)
    }
    setLoading(false)
  }

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case 'web':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
      case 'design':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7M7 21V9a2 2 0 012-2h10a2 2 0 012 2v4M7 21h4" />
          </svg>
        )
      case 'video':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      case 'database':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        )
      case 'it':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: colors.primary_color }}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff' }}>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackData.subpageHeros.services})` }}
        ></div>
        
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(90deg, ${colors.primary_color} 0%, ${colors.primary_color}E6 40%, ${colors.primary_color}30 100%)`
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              OUR SERVICES
            </h1>
            
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">
                HOME
              </a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">SERVICES</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
              <span className="text-gray-500 uppercase tracking-wider text-sm">
                WHAT WE OFFER
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[#012340]">
              Our <span className="text-[#FCB316]">Services</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.primary_color }}>
              We provide comprehensive technology solutions to help your business grow and succeed in the digital world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-sm transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Light Background Overlay - Slides from bottom to top */}
                <div className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                
                {/* Bottom Border - Slides from left to right */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ backgroundColor: colors.accent_color }}></div>
                
                <div className="text-center relative z-10">
                  <div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" 
                    style={{ backgroundColor: colors.primary_color, color: 'white' }}
                  >
                    {service.icon_svg ? (
                      <div dangerouslySetInnerHTML={{ __html: service.icon_svg }} />
                    ) : (
                      getServiceIcon(service.icon)
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-white transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-100 leading-relaxed mb-8 text-sm transition-colors">
                    {service.description}
                  </p>
                  
                  <a
                    href={`/services/${service.id}`}
                    className="relative inline-flex items-center justify-center w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 overflow-hidden group/btn border-blue-400"
                    style={{ backgroundColor: 'transparent', color: colors.primary_color, border: '1px solid #60a5fa' }}
                  >
                    <span className="relative z-10 group-hover/btn:text-blue-600 transition-colors">Learn More</span>
                    <svg className="w-4 h-4 ml-2 relative z-10 group-hover/btn:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="absolute inset-0 scale-0 group-hover:scale-100 group-hover/btn:scale-100 transition-transform duration-300 ease-out rounded-lg bg-white"></div>
                  </a>
                </div>
                
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" style={{ backgroundColor: colors.accent_color }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-3xl font-bold mb-4" style={{ color: colors.secondary_color }}>
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project requirements and see how we can help bring your ideas to life.
            </p>
            <a href="/contact#contact-form" className="relative inline-block px-8 py-4 rounded-sm font-semibold shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
              <span className="relative z-10 group-hover:text-white transition-colors">Contact Us Today</span>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}