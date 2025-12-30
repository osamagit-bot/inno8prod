'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'
import { fallbackData } from '../lib/fallbackData'

interface SiteSettings {
  site_name: string
  email: string
  phone: string
  address: string
  working_hours: string
  facebook_url?: string
  instagram_url?: string
  telegram_url?: string
  linkedin_url?: string
  youtube_url?: string
  logo?: string
  mobile_logo?: string
}

interface Service {
  id: number
  name: string
  is_active: boolean
  order: number
}

interface MenuItem {
  id: number
  name: string
  url: string
  is_active: boolean
  order: number
}

export default function Footer() {
  const colors = useColors()
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(fallbackData.siteSettings)
  const [services, setServices] = useState<Service[]>(fallbackData.services.slice(0, 5))
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  const [scrollProgress, setScrollProgress] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    fetchSiteSettings()
    fetchServices()
    fetchMenuItems()
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))
      
      // Show button when scrolled past hero section (approximately 100vh)
      setShowButton(window.scrollY > window.innerHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SITE_SETTINGS)
      if (response.ok) {
        const data = await response.json()
        setSiteSettings(data)
      }
    } catch (error) {
      console.log('Backend offline - using fallback site settings')
      setSiteSettings(fallbackData.siteSettings)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SERVICES)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setServices(data.slice(0, 5))
        }
      }
    } catch (error) {
      console.log('Backend offline - using fallback services')
      setServices(fallbackData.services.slice(0, 5))
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MENU_ITEMS)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setMenuItems(data.slice(0, 5))
        } else {
          setMenuItems(fallbackData.menuItems.slice(0, 5))
        }
      }
    } catch (error) {
      console.log('Backend offline - using fallback menu items')
      setMenuItems(fallbackData.menuItems.slice(0, 5))
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: colors.primary_color }}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 transform -translate-x-1/2 -translate-y-1/2 rotate-45" style={{ background: `linear-gradient(135deg, ${colors.primary_color}20, transparent)` }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 transform translate-x-1/2 translate-y-1/2 rotate-45" style={{ background: `linear-gradient(315deg, ${colors.primary_color}20, transparent)` }}></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 transform translate-x-1/2 -translate-y-1/2 rotate-12" style={{ background: `linear-gradient(270deg, ${colors.primary_color}10, transparent)` }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Image
                src={siteSettings.mobile_logo ? getImageUrl(siteSettings.mobile_logo) : "/images/inoo8 With Bg.jpg"}
                alt={siteSettings.site_name}
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-2xl font-bold text-white">{siteSettings.site_name}</span>
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              We are a leading software house delivering innovative digital solutions and exceptional user experiences to transform your business.
            </p>
            <div className="flex space-x-3">
              <a key="facebook" href={siteSettings.facebook_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center text-gray-300 transition-colors" style={{ backgroundColor: colors.secondary_color }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary_color; e.currentTarget.style.color = 'white' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.secondary_color; e.currentTarget.style.color = '#d1d5db' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a key="instagram" href={siteSettings.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center text-gray-300 transition-colors" style={{ backgroundColor: colors.secondary_color }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary_color; e.currentTarget.style.color = 'white' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.secondary_color; e.currentTarget.style.color = '#d1d5db' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a key="telegram" href={siteSettings.telegram_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center text-gray-300 transition-colors" style={{ backgroundColor: colors.secondary_color }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary_color; e.currentTarget.style.color = 'white' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.secondary_color; e.currentTarget.style.color = '#d1d5db' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a key="linkedin" href={siteSettings.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center text-gray-300 transition-colors" style={{ backgroundColor: colors.secondary_color }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary_color; e.currentTarget.style.color = 'white' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.secondary_color; e.currentTarget.style.color = '#d1d5db' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a key="youtube" href={siteSettings.youtube_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center text-gray-300 transition-colors" style={{ backgroundColor: colors.secondary_color }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary_color; e.currentTarget.style.color = 'white' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.secondary_color; e.currentTarget.style.color = '#d1d5db' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* IT Solution */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">IT Solution</h3>
            <ul className="space-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                      <span style={{ color: colors.accent_color }} className="mr-2">»</span>
                      {service.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li key="web-dev"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Web Development</a></li>
                  <li key="mobile-apps"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Mobile Apps</a></li>
                  <li key="software-dev"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Software Development</a></li>
                  <li key="ui-ux"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>UI/UX Design</a></li>
                  <li key="digital-marketing"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Digital Marketing</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Link</h3>
            <ul className="space-y-3">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <li key={item.id}>
                    <a href={item.url} className="text-gray-300 hover:text-white transition-colors flex items-center">
                      <span style={{ color: colors.accent_color }} className="mr-2">»</span>
                      {item.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li key="about"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>About Inno8</a></li>
                  <li key="services"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Our Services</a></li>
                  <li key="portfolio"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Portfolio</a></li>
                  <li key="projects"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Our Projects</a></li>
                  <li key="team"><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center"><span style={{ color: colors.accent_color }} className="mr-2">»</span>Our Team</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                {siteSettings.address}
              </p>
              
              {/* Working Hours */}
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Opening Hours:</p>
                  <p className="text-gray-300 text-sm">{siteSettings.working_hours}</p>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="text-white font-medium">Phone Call:</p>
                  <p className="text-gray-300 text-sm">{siteSettings.phone}</p>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="text-white font-medium">Send E-Mail:</p>
                  <p className="text-gray-300 text-sm">{siteSettings.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-500 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-200 text-sm mb-4 md:mb-0">
            © All Copyright {new Date().getFullYear()} by {siteSettings.site_name}
          </p>
          <div className="flex space-x-8 text-sm">
            <a key="terms" href="#" className="text-gray-200 hover:text-white transition-colors">Terms & Condition</a>
            <a key="privacy" href="#" className="text-gray-200 hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button with Progress Ring */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          aria-label="Back to top"
        >
          <svg className="absolute inset-0 w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={colors.primary_color}
              strokeWidth="2"
              strokeDasharray={`${scrollProgress}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <svg className="w-5 h-5 z-10" fill="none" stroke={colors.primary_color} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

    </footer>
  )
}