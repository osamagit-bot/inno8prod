'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'
import { fallbackData } from '../lib/fallbackData'

interface ClientLogo {
  id: number
  name: string
  logo: string
  order: number
  is_active: boolean
}

export default function ClientLogosSection() {
  const colors = useColors()
  const [logos, setLogos] = useState<ClientLogo[]>(fallbackData.clientLogos)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CLIENT_LOGOS)
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setLogos(data)
          }
        }
      } catch (error) {
        console.log('Backend offline - using fallback client logos')
        setLogos(fallbackData.clientLogos)
      } finally {
        setLoading(false)
      }
    }

    fetchLogos()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-500">Loading client logos...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
       

        {/* Logos Marquee */}
        <div className="overflow-hidden" data-aos="fade-up" data-aos-delay="200">
          <div className="flex animate-marquee space-x-8">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="flex-shrink-0 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[150px]"
              >
                <Image
                  src={getImageUrl(logo.logo)}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="max-w-full h-auto object-contain transition-all duration-300 rounded-lg"
                  style={{ width: 'auto', height: 'auto' }}
                  onError={(e) => {
                    console.log('Logo failed to load:', logo.logo, 'Generated URL:', getImageUrl(logo.logo))
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}