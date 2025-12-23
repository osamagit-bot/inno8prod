'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'

interface AboutContent {
  subtitle: string
  title: string
  button_text: string
  mission_title: string
  mission_description: string
  vision_title: string
  vision_description: string
  image1: string
  image2: string
  floating_text: string
}

export default function AboutSection() {
  const colors = useColors()
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    subtitle: 'About Your Company',
    title: 'We Execute Ideas\nFrom Start to Finish',
    button_text: 'Know More',
    mission_title: 'Our Mission',
    mission_description: 'Our mission is to push boundaries, engage audiences, and drive innovation through cutting-edge technology solutions.',
    vision_title: 'Our Vision',
    vision_description: 'To become the leading software house that transforms businesses through innovative digital solutions and exceptional user experiences.',
    image1: '/images/about1.avif',
    image2: '/images/about2.webp',
    floating_text: 'Repellendus autem ruibusdam at aut officiis debitis aut re necessitatibus saepe eveniet ut et repudianda sint et molestiae non recusandae.'
  })

  useEffect(() => {
    fetchAboutContent()
    
    // Initialize AOS
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ABOUT_SECTION)
      if (response.ok) {
        const data = await response.json()
        setAboutContent({
          subtitle: data.subtitle || aboutContent.subtitle,
          title: data.title || aboutContent.title,
          button_text: data.button_text || aboutContent.button_text,
          mission_title: data.mission_title || aboutContent.mission_title,
          mission_description: data.mission_description || aboutContent.mission_description,
          vision_title: data.vision_title || aboutContent.vision_title,
          vision_description: data.vision_description || aboutContent.vision_description,
          image1: getImageUrl(data.image1) || aboutContent.image1,
          image2: getImageUrl(data.image2) || aboutContent.image2,
          floating_text: data.floating_text || aboutContent.floating_text
        })
      }
    } catch (error) {
      console.log('Using default about content')
    }
  }
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 rounded-full mr-4" style={{ backgroundColor: colors.primary_color }}></div>
            <h3 className="text-lg font-medium" style={{ color: colors.primary_color }} data-aos="fade-down">{aboutContent.subtitle}</h3>
            <div className="w-12 h-1 rounded-full ml-4" style={{ backgroundColor: colors.primary_color }}></div>
          </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight" style={{ color: colors.secondary_color }} data-aos="fade-up" data-aos-delay="200">
              {aboutContent.title.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < aboutContent.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
            <button className="relative bg-transparent border font-medium mb-12 overflow-hidden group transition-colors px-8 py-3 rounded-sm group-hover:text-white" style={{ borderColor: colors.primary_color, color: colors.primary_color }} data-aos="fade-up" data-aos-delay="400">
              <span className="relative z-10 group-hover:text-white">{aboutContent.button_text}</span>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
            </button>

            {/* Mission, Vision, Awards */}
            <div className="space-y-8">
              {/* Our Mission */}
              <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="600">
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary_color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2" style={{ color: colors.secondary_color }}>{aboutContent.mission_title}</h4>
                  <p className="text-gray-600">{aboutContent.mission_description}</p>
                </div>
              </div>

              {/* Our Vision */}
              <div className="flex items-start space-x-4" data-aos="fade-down" data-aos-delay="800">
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary_color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2" style={{ color: colors.secondary_color }}>{aboutContent.vision_title}</h4>
                  <p className="text-gray-600">{aboutContent.vision_description}</p>
                </div>
              </div>

          
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Image */}
              <div className="col-span-2 overflow-hidden rounded-lg">
                <img 
                  src={aboutContent.image1} 
                  alt="About Inno8" 
                  className="w-full h-64 object-cover shadow-lg hover:scale-110 transition-transform duration-300"
                />
              </div>
              {/* Bottom Right Image */}
              <div className="col-start-2 overflow-hidden rounded-lg">
                <img 
                  src={aboutContent.image2} 
                  alt="About Our Team" 
                  className="w-full h-48 object-cover shadow-lg hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            
            {/* Floating Text Box */}
            <div className="absolute bottom-4 left-4 p-6 rounded-sm shadow-md max-w-sm animate-bounce" style={{ backgroundColor: colors.accent_color }}>
              <p className="text-black text-sm leading-relaxed">
                {aboutContent.floating_text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}