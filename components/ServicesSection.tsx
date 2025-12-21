'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'

interface ServicesSectionContent {
  subtitle: string
  title: string
  title_highlight: string
  button_text: string
}

interface Service {
  id: number
  name: string
  description: string
  icon: string
  icon_svg?: string
  order: number
}

export default function ServicesSection() {
  const colors = useColors()
  const [sectionContent, setSectionContent] = useState<ServicesSectionContent>({
    subtitle: 'OUR OFFERING',
    title: 'Enhance And Pioneer Using',
    title_highlight: 'Technology Trends',
    button_text: 'Explore More'
  })
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetchSectionContent()
    fetchServices()
    
    // Initialize AOS
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  const fetchSectionContent = async () => {
    try {
      const response = await fetch('http://localhost:8010/api/services-section/')
      if (response.ok) {
        const data = await response.json()
        setSectionContent({
          subtitle: data.subtitle || sectionContent.subtitle,
          title: data.title || sectionContent.title,
          title_highlight: data.title_highlight || sectionContent.title_highlight,
          button_text: data.button_text || sectionContent.button_text
        })
      }
    } catch (error) {
      console.log('Using default services section content')
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8010/api/services/')
      if (response.ok) {
        const data = await response.json()
        setServices(data) // Always use backend data, even if empty
      }
    } catch (error) {
      console.log('Error fetching services:', error)
      setServices([]) // Show empty if API fails
    }
  }

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case 'web':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
      case 'design':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7M7 21V9a2 2 0 012-2h10a2 2 0 012 2v4M7 21h4" />
          </svg>
        )
      case 'video':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      case 'database':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        )
      case 'it':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'support':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25zm0 0v19.5" />
          </svg>
        )
      default:
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
  }

  return (
    <section 
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/cardbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-blue-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-blue-300/20 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 rounded-full mr-4" style={{ backgroundColor: colors.primary_color }}></div>
            <span className="text-lg font-medium" style={{ color: colors.primary_color }}>
              {sectionContent.subtitle}
            </span>
            <div className="w-12 h-1 rounded-full ml-4" style={{ backgroundColor: colors.primary_color }}></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" data-aos="fade-up" data-aos-delay="200">
            {sectionContent.title}<br />
            <span style={{ color: colors.accent_color }}>{sectionContent.title_highlight}</span>
          </h2>
          <div className="flex justify-end" data-aos="fade-left" data-aos-delay="400">
            <button className="relative bg-transparent border font-medium overflow-hidden group transition-colors px-8 py-3 rounded-sm text-white" style={{ borderColor: colors.primary_color }}>
              <span className="relative z-10 flex items-center space-x-2">
                <span>{sectionContent.button_text}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Service Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" style={{ backgroundColor: colors.primary_color + '20', color: colors.primary_color }}>
                  {service.icon_svg ? (
                    <div dangerouslySetInnerHTML={{ __html: service.icon_svg }} />
                  ) : (
                    getServiceIcon(service.icon)
                  )}
                </div>
              </div>

              {/* Service Title */}
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                {service.name}
              </h3>

              {/* Service Description */}
              {service.description && (
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
              )}

              {/* Arrow Icon - Bottom Right */}
              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" style={{ backgroundColor: colors.primary_color }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}