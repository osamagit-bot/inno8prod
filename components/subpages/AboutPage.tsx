'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useColors } from '../../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../../lib/api'
import Footer from '../Footer'
import TeamSection from '../TeamSection'

interface AboutContent {
  mission_title: string
  mission_description: string
  vision_title: string
  vision_description: string
  overview_title: string
  overview_description1: string
  overview_description2: string
  projects_count: number
  years_experience: number
}

export default function AboutPage() {
  const colors = useColors()
  const [projectsCount, setProjectsCount] = useState(0)
  const [yearsCount, setYearsCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    mission_title: 'Our Mission',
    mission_description: 'To empower businesses with innovative technology solutions that drive growth, efficiency, and success.',
    vision_title: 'Our Vision',
    vision_description: 'To be the leading software house that shapes the future of digital innovation.',
    overview_title: 'Company Overview',
    overview_description1: 'Founded with a vision to bridge the gap between innovative technology and business success, Inno8 has been at the forefront of digital transformation.',
    overview_description2: 'Our team combines technical expertise with creative thinking to deliver solutions that are functional, user-friendly and scalable.',
    projects_count: 50,
    years_experience: 5
  })
  const statsRef = useRef(null)
  const [statsCounters, setStatsCounters] = useState({ customers: 0, projects: 0, experts: 0, satisfaction: 0 })
  const [statsAnimated, setStatsAnimated] = useState(false)
  const statsMainRef = useRef(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)
  const itemsPerSlide = 4

  useEffect(() => {
    const loadData = async () => {
      try {
        const aboutData = await fetch(API_ENDPOINTS.ABOUT_SECTION).then(res => res.ok ? res.json() : null)
        if (aboutData) {
          const newContent = {
            mission_title: aboutData.mission_title || aboutContent.mission_title,
            mission_description: aboutData.mission_description || aboutContent.mission_description,
            vision_title: aboutData.vision_title || aboutContent.vision_title,
            vision_description: aboutData.vision_description || aboutContent.vision_description,
            overview_title: aboutData.overview_title || aboutContent.overview_title,
            overview_description1: aboutData.overview_description1 || aboutContent.overview_description1,
            overview_description2: aboutData.overview_description2 || aboutContent.overview_description2,
            projects_count: aboutData.projects_count || aboutContent.projects_count,
            years_experience: aboutData.years_experience || aboutContent.years_experience
          }
          setAboutContent(newContent)
        }
        
        // Fetch team members
        const teamData = await fetch(API_ENDPOINTS.TEAM_MEMBERS).then(res => res.ok ? res.json() : [])
        setTeamMembers(teamData)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCounter(setProjectsCount, aboutContent.projects_count, 2000)
            animateCounter(setYearsCount, aboutContent.years_experience, 2000)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, aboutContent.projects_count, aboutContent.years_experience])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            setStatsAnimated(true)
            animateCounter((val) => setStatsCounters(prev => ({ ...prev, customers: val })), 500, 2000)
            animateCounter((val) => setStatsCounters(prev => ({ ...prev, projects: val })), 150, 2500)
            animateCounter((val) => setStatsCounters(prev => ({ ...prev, experts: val })), 20, 3000)
            animateCounter((val) => setStatsCounters(prev => ({ ...prev, satisfaction: val })), 100, 3500)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (statsMainRef.current) {
      observer.observe(statsMainRef.current)
    }

    return () => observer.disconnect()
  }, [statsAnimated])

  const animateCounter = (setter, target, duration) => {
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setter(target)
        clearInterval(timer)
      } else {
        setter(Math.floor(start))
      }
    }, 16)
  }

  const totalSlides = Math.ceil(teamMembers.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentMembers = () => {
    const startIndex = currentSlide * itemsPerSlide
    return teamMembers.slice(startIndex, startIndex + itemsPerSlide)
  }



  const coreValues = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge solutions."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7H16c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h1v4h2zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
        </svg>
      ),
      title: "Reliability",
      description: "Our commitment to quality ensures successful project completion."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
        </svg>
      ),
      title: "Excellence",
      description: "We strive for perfection in every project we deliver."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: "Customer Focus",
      description: "Your success is our priority in everything we do."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/abouthero.jpg"
            alt="About Hero"
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
              ABOUT US
            </h1>
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">
                HOME
              </a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">ABOUT US</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-3">
            <div className="flex items-center mb-4">
              <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
              <span className="text-gray-500 uppercase tracking-wider text-sm">
                About Our Company
              </span>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: colors.primary_color }}>
              {aboutContent.overview_title}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {aboutContent.overview_description1}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {aboutContent.overview_description2}
              </p>
              <div className="grid grid-cols-2 gap-6" ref={statsRef}>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: colors.accent_color }}>{projectsCount}+</div>
                  <div className="text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: colors.accent_color }}>{yearsCount}+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative group">
              {/* Background Border */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-lg" style={{ backgroundColor: colors.primary_color }}></div>
              
              {/* Image */}
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/images/about1.avif"
                  alt="About Inno8"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-16 px-4" >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
              <span className="text-gray-500 uppercase tracking-wider text-sm">
                Mission & Vision
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#012340]">
              Our Purpose & Direction
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8" >
            <div className="p-8 rounded-lg shadow-sm" style={{'backgroundColor':'#f8f9fa'}}>
              <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary_color + '15' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary_color }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary_color }}>{aboutContent.mission_title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {aboutContent.mission_description}
              </p>
            </div>
            <div className="p-8 rounded-lg shadow-sm" style={{'backgroundColor':'#f8f9fa'}}>
              <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary_color + '15' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary_color }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 id="vision" className="text-2xl font-bold mb-4" style={{ color: colors.primary_color }}>{aboutContent.vision_title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {aboutContent.vision_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
              <span className="text-gray-500 uppercase tracking-wider text-sm">OUR PROFESSIONAL</span>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.primary_color }}>
              Meet Our Experts People
            </h2>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {getCurrentMembers().map((member) => (
              <div
                key={member.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredCard(member.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="rounded-tl-[4rem] rounded-br-[4rem] shadow-sm overflow-hidden transition-all duration-300" style={{'backgroundColor':'#f8f9fa'}}>
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image ? getImageUrl(member.image) : '/images/placeholder-team.jpg'}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0477BF] via-[#0477BF]/80 to-transparent transition-all duration-500 ${
                      hoveredCard === member.id ? 'h-full' : 'h-0'
                    }`}>
                      <div className={`absolute bottom-8 left-8 text-white transition-all duration-300 ${
                        hoveredCard === member.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}>
                        <p className="text-xs uppercase tracking-wider mb-1 opacity-90">
                          {member.position}
                        </p>
                        <h3 className="text-xl font-bold">
                          {member.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-center space-x-4">
                      {member.facebook_url && member.facebook_url.trim() !== '' ? (
                        <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0477BF] transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-300 cursor-default">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </span>
                      )}
                      
                      {member.twitter_url && member.twitter_url.trim() !== '' ? (
                        <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#048ABF] transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-300 cursor-default">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </span>
                      )}
                      
                      {member.google_plus_url && member.google_plus_url.trim() !== '' ? (
                        <a href={member.google_plus_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#048ABF] transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-300 cursor-default">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </span>
                      )}
                      
                      {member.pinterest_url && member.pinterest_url.trim() !== '' ? (
                        <a href={member.pinterest_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FCB316] transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-300 cursor-default">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
            
            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-300 hover:opacity-80"
                  style={{ backgroundColor: colors.primary_color }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-300 hover:opacity-80"
                  style={{ backgroundColor: colors.primary_color }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Dots Indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      currentSlide === index ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: colors.primary_color }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section 
        ref={statsMainRef}
        className="py-16 px-4 mb-6 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary_color} 0%, #001a2e 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rotate-45"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rotate-12"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rotate-45"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {statsCounters.customers}+
              </div>
              <div className="text-white/80 uppercase tracking-wider text-sm">
                HAPPY CUSTOMERS
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {statsCounters.projects}+
              </div>
              <div className="text-white/80 uppercase tracking-wider text-sm">
                WORKS COMPLETED
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {statsCounters.experts}+
              </div>
              <div className="text-white/80 uppercase tracking-wider text-sm">
                EXPERT MEMBERS
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {statsCounters.satisfaction}%
              </div>
              <div className="text-white/80 uppercase tracking-wider text-sm">
                SATISFACTION RATES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 mb-8" style={{ backgroundColor: colors.primary_color }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
              <span className="text-white/70 uppercase tracking-wider text-sm">OUR VALUES</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Core Values
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Our values guide everything we do and shape how we work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transition-colors duration-300 overflow-hidden group cursor-pointer">
                <div className="text-white mb-4 flex justify-center relative z-10">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white relative z-10">
                  {value.title}
                </h3>
                <p className="text-white/80 leading-relaxed relative z-10">
                  {value.description}
                </p>
                <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out bg-white/20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}