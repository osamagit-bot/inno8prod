'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS } from '../lib/api'

interface ContactInfo {
  id: number
  title: string
  value: string
  icon_svg: string
  order: number
  is_active: boolean
}

interface SectionData {
  subtitle: string
  title: string
  description: string
}

export default function CTASection() {
  const colors = useColors()
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [sectionData, setSectionData] = useState<SectionData>({
    subtitle: 'Get In Touch',
    title: 'Contact Us',
    description: 'Ready to transform your ideas into reality? Let\'s build something amazing together.'
  })

  useEffect(() => {
    fetchContactData()
    fetchSectionData()
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

  const fetchSectionData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_SECTION)
      if (response.ok) {
        const data = await response.json()
        setSectionData({
          subtitle: data.subtitle || sectionData.subtitle,
          title: data.title || sectionData.title,
          description: data.description || sectionData.description
        })
      }
    } catch (error) {
      console.log('Using default section data')
    }
  }

  const setDefaultContactInfo = () => {
    setContactInfo([
      {
        id: 1,
        title: 'Call us Any time',
        value: '+123 (4567) 890',
        icon_svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>',
        order: 1,
        is_active: true
      },
      {
        id: 2,
        title: 'Send E-Mail',
        value: 'info@gmail.com',
        icon_svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
        order: 2,
        is_active: true
      },
      {
        id: 3,
        title: 'Opening Hours',
        value: 'Mon - Fri (8.00 - 5.00)',
        icon_svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        order: 3,
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

  return (
    <section className="py-20 border-b-2 border-blue-400/20" style={{ backgroundColor: colors.primary_color }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
            <span className="text-gray-300 uppercase tracking-wider text-sm">
              {sectionData.subtitle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {sectionData.title.split(' ').map((word, index) => 
              word === 'Us' ? (
                <span key={`title-${word}-${index}`} style={{ color: colors.accent_color }}>{word}</span>
              ) : (
                <span key={`title-${word}-${index}`}>{word} </span>
              )
            )}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </div>
        
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {contactInfo.map((info, index) => (
            <div key={info.id} className="relative overflow-hidden rounded-lg border border-white/20 group cursor-pointer">
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                  <div className="text-white group-hover:text-blue-600 transition-colors duration-500" dangerouslySetInnerHTML={{ __html: parseIconSvg(info.icon_svg) }} />
                </div>
                <h3 className="text-sm font-medium text-white/80 group-hover:text-gray-600 transition-colors duration-500 mb-1">{info.title}</h3>
                <p className="text-lg font-semibold text-white group-hover:text-blue-600 transition-colors duration-500">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}