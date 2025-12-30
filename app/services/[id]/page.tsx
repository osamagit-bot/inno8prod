'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useColors } from '../../../contexts/ColorContext'
import { API_ENDPOINTS } from '../../../lib/api'
import Image from 'next/image'
import Footer from '../../../components/Footer'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  icon_svg?: string
  order: number
}

export default function ServiceDetailPage() {
  const colors = useColors()
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      fetchServices(params.id as string)
    }
  }, [params?.id])

  const fetchServices = async (serviceId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.SERVICES)
      if (response.ok) {
        const services = await response.json()
        const foundService = services.find((s: Service) => s.id.toString() === serviceId)
        setService(foundService || null)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
    setLoading(false)
  }

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case 'web':
        return (
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
      case 'design':
        return (
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7M7 21V9a2 2 0 012-2h10a2 2 0 012 2v4M7 21h4" />
          </svg>
        )
      default:
        return (
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <a href="/services" className="text-blue-600 hover:underline">Back to Services</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff' }}>
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/abouthero.jpg" alt="Service Hero" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${colors.primary_color} 0%, ${colors.primary_color}E6 40%, ${colors.primary_color}30 100%)` }}></div>
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{service.name}</h1>
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">HOME</a>
              <span className="text-white/60">-</span>
              <a href="/services" className="hover:text-opacity-80 transition-colors">SERVICES</a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">{service.name.toUpperCase()}</span>
            </nav>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-32 h-32 mx-auto mb-8 rounded-3xl flex items-center justify-center" style={{ backgroundColor: colors.primary_color, color: 'white' }}>
                {service.icon_svg ? (
                  <div dangerouslySetInnerHTML={{ __html: service.icon_svg }} />
                ) : (
                  getServiceIcon(service.icon)
                )}
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.secondary_color }}>{service.name}</h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">{service.description}</p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4" style={{ color: colors.secondary_color }}>Ready to Get Started?</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Let's discuss your {service.name.toLowerCase()} needs and create a solution that drives your business forward.</p>
              <a href="/contact#contact-form" className="relative inline-block px-8 py-4 rounded-sm font-semibold shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
                <span className="relative z-10 group-hover:text-white transition-colors">Start Your Project</span>
                <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}