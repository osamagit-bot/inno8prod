'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS } from '../lib/api'

interface WorkingProcessStep {
  id: number
  number: string
  title: string
  description: string
  icon_svg: string
  order: number
  is_active: boolean
}

interface SectionData {
  subtitle: string
  title: string
  description: string
}

export default function WorkingProcess() {
  const colors = useColors()
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [steps, setSteps] = useState<WorkingProcessStep[]>([])
  const [sectionData, setSectionData] = useState<SectionData>({
    subtitle: 'How We Work',
    title: 'Our Working Process',
    description: 'We follow a proven methodology to deliver exceptional results for every project'
  })
  useEffect(() => {
    fetchWorkingProcessData()
    fetchSectionData()
  }, [])

  useEffect(() => {
    console.log('Steps updated:', steps)
  }, [steps])

  const fetchWorkingProcessData = async () => {
    try {
      console.log('Fetching working process data from:', API_ENDPOINTS.WORKING_PROCESS)
      const response = await fetch(API_ENDPOINTS.WORKING_PROCESS)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Working process data received:', data)
        const activeSteps = data.filter((step: WorkingProcessStep) => step.is_active).sort((a: WorkingProcessStep, b: WorkingProcessStep) => a.order - b.order)
        console.log('Active steps:', activeSteps)
        setSteps(activeSteps)
      } else {
        console.log('Response not ok, using default steps')
        setDefaultSteps()
      }
    } catch (error) {
      console.log('Error fetching working process data:', error)
      console.log('Using default working process steps')
      setDefaultSteps()
    }
  }

  const fetchSectionData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WORKING_PROCESS_SECTION)
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
      .replace(/fillRule=/g, 'fill-rule=')
      .replace(/clipRule=/g, 'clip-rule=')
  }

  const setDefaultSteps = () => {
    setSteps([
      {
        id: 1,
        number: '01',
        title: 'Discovery & Planning',
        description: 'We analyze your requirements and create a comprehensive project roadmap.',
        icon_svg: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>',
        order: 1,
        is_active: true
      },
      {
        id: 2,
        number: '02',
        title: 'Design & Development',
        description: 'Our expert team brings your vision to life with cutting-edge technology.',
        icon_svg: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>',
        order: 2,
        is_active: true
      },
      {
        id: 3,
        number: '03',
        title: 'Testing & Quality',
        description: 'Rigorous testing ensures your solution meets the highest standards.',
        icon_svg: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        order: 3,
        is_active: true
      },
      {
        id: 4,
        number: '04',
        title: 'Launch & Support',
        description: 'We deploy your solution and provide ongoing support for success.',
        icon_svg: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
        order: 4,
        is_active: true
      }
    ])
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0')
            setVisibleSteps(prev => [...new Set([...prev, stepIndex])])
          }
        })
      },
      { threshold: 0.3 }
    )

    const stepElements = document.querySelectorAll('[data-step]')
    stepElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [steps])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <section className="py-20" style={{ backgroundColor: '#fff' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 rounded-full mr-4" style={{ backgroundColor: colors.primary_color }}></div>
            <span className="text-lg font-medium" style={{ color: colors.primary_color }}>
              {sectionData.subtitle}
            </span>
            <div className="w-12 h-1 rounded-full ml-4" style={{ backgroundColor: colors.primary_color }}></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.secondary_color }}>
            {sectionData.title.split(' ').map((word, index) => 
              word === 'Process' ? (
                <span key={index} style={{ color: colors.primary_color }}>{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {steps.map((step, index) => (
            <div
              key={index}
              data-step={index}
              className={`relative transform transition-all duration-1000 ${
                visibleSteps.includes(index) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Step Card */}
              <div className={`rounded-2xl p-8 shadow-sm transition-all duration-500 relative overflow-hidden ${
                activeStep === index ? 'ring-1' : ''
              }`} style={{ backgroundColor: '#FAFAFA', ringColor: activeStep === index ? colors.primary_color : 'transparent' }}>
                
                {/* Animated Background */}
                <div className={`absolute inset-0 transform transition-transform duration-700 ${
                  activeStep === index ? 'scale-100 opacity-10' : 'scale-0 opacity-0'
                }`} style={{ backgroundColor: colors.primary_color }}></div>

                {/* Step Number */}
                <div className="relative z-10 mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500 ${
                    activeStep === index ? 'animate-pulse' : ''
                  }`} style={{ 
                    backgroundColor: activeStep === index ? colors.primary_color : colors.accent_color,
                    color: 'white'
                  }}>
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className={`relative z-10 mb-4 transition-all duration-500 ${
                  activeStep === index ? 'animate-bounce' : ''
                }`} style={{ color: colors.primary_color }}>
                  <div dangerouslySetInnerHTML={{ __html: parseIconSvg(step.icon_svg) }} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.secondary_color }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>


              </div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    visibleSteps.includes(index) ? 'animate-pulse' : ''
                  }`} style={{ backgroundColor: colors.primary_color }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-12 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer ${
                activeStep === index ? 'scale-125' : 'scale-100'
              }`}
              style={{ 
                backgroundColor: activeStep === index ? colors.primary_color : colors.accent_color,
                opacity: activeStep === index ? 1 : 0.5
              }}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}