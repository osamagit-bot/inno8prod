'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'

interface ClientLogo {
  id: number
  name: string
  logo: string
  order: number
  is_active: boolean
}

export default function ClientLogosSection() {
  const colors = useColors()
  const [logos, setLogos] = useState<ClientLogo[]>([])
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
          setLogos(data)
        }
      } catch (error) {
        console.error('Error fetching client logos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogos()
  }, [])

  if (loading || logos.length === 0) {
    return null
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}