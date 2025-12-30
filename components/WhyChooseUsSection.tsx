'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS } from '../lib/api'
import { fallbackData } from '../lib/fallbackData'

interface Feature {
  id: number
  title: string
  description: string
  icon_svg: string
  order: number
  is_active: boolean
}

interface SectionData {
  subtitle: string
  title: string
  breadcrumb_items: string
}

export default function WhyChooseUsSection() {
  const colors = useColors()
  const [features, setFeatures] = useState<Feature[]>(fallbackData.whyChooseUsFeatures)
  const [sectionData, setSectionData] = useState<SectionData>(fallbackData.whyChooseUsSection)
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
    const fetchData = async () => {
      try {
        const [featuresResponse, sectionResponse] = await Promise.all([
          fetch(API_ENDPOINTS.WHY_CHOOSE_US),
          fetch(API_ENDPOINTS.WHY_CHOOSE_US_SECTION)
        ])
        
        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json()
          if (featuresData.length > 0) {
            setFeatures(featuresData)
          }
        }
        
        if (sectionResponse.ok) {
          const sectionData = await sectionResponse.json()
          setSectionData(sectionData)
        }
      } catch (error) {
        console.log('Backend offline - using fallback why choose us data')
        setFeatures(fallbackData.whyChooseUsFeatures)
        setSectionData(fallbackData.whyChooseUsSection)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Circular Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-400/10 to-transparent rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
            <span className="text-gray-300 uppercase tracking-wider text-sm">
              {sectionData.subtitle}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {sectionData.title?.split(' ').map((word, index) => 
              word === 'INNO8' ? (
                <span key={`title-${word}-${index}`} style={{ color: colors.accent_color }}>{word}</span>
              ) : (
                <span key={`title-${word}-${index}`}>{word} </span>
              )
            )}
          </h2>
          <div className="flex items-center justify-center space-x-8 text-white/80">
            {sectionData.breadcrumb_items?.split(',').map((item, index, array) => (
              <div key={`breadcrumb-${index}`} className="flex items-center">
                <span className="text-lg font-medium">{item.trim()}</span>
                {index < array.length - 1 && <div className="w-2 h-2 rounded-full bg-white/60 ml-8"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Outer Orange Circle */}
              <div className="w-72 h-72 mx-auto rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: colors.accent_color }}>
                {/* Inner Circular Card */}
                <div className="group relative w-64 h-64 rounded-full bg-white/95 backdrop-blur-sm border-2 flex flex-col items-center justify-center p-8 hover:scale-105 transition-all duration-500 shadow-xl overflow-hidden" style={{ borderColor: colors.primary_color }}>
                  {/* Icon */}
                  <div className="mb-4 relative z-10">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary_color + '20', color: colors.primary_color }}
                    >
                      <div 
                        className="w-12 h-12" 
                        dangerouslySetInnerHTML={{ __html: feature.icon_svg }}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-center relative z-10" style={{ color: colors.secondary_color }}>
                    {feature.title}
                  </h3>

                  {/* Yellow overlay animation */}
                  <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.accent_color }}></div>
                </div>
              </div>

              {/* Description below circle */}
              <div className="mt-6 text-center">
                <p className="text-white/90 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}