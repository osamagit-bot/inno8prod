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

interface MenuItem {
  id: number
  name: string
  url: string
  is_active: boolean
  order: number
  children?: { name: string; url: string }[]
}

export default function Header() {
  const colors = useColors()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(fallbackData.siteSettings)
  const [menuItems, setMenuItems] = useState<any[]>(fallbackData.menuItems)

  useEffect(() => {
    fetchSiteSettings()
    fetchMenuItems()
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 64)
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

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MENU_ITEMS)
      
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const parentItems = data.filter((item: any) => !item.parent).sort((a: any, b: any) => a.order - b.order)
          const structuredMenu = parentItems.map((parent: any) => ({
            name: parent.name,
            url: parent.url,
            children: parent.children && parent.children.length > 0 ? parent.children.map((child: any) => ({
              name: child.name,
              url: child.url
            })) : undefined
          }))
          setMenuItems(structuredMenu)
        }
      }
    } catch (error) {
      console.log('Backend offline - using fallback menu items')
      setMenuItems(fallbackData.menuItems)
    }
  }

  useEffect(() => {
    if (isMenuOpen) {
      setShowOverlay(true)
      const timer = setTimeout(() => {
        setShowMenu(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowMenu(false)
      setShowOverlay(false)
    }
  }, [isMenuOpen])

  const closeMenu = () => {
    setShowMenu(false)
    setShowOverlay(false)
    setOpenDropdown(null)
    setTimeout(() => {
      setIsMenuOpen(false)
    }, 700)
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  return (
    <>
      {/* Top Bar - Desktop Only */}
      <div className="hidden lg:block py-4 px-6 relative overflow-hidden">
        <div className="container mx-auto flex justify-between items-center text-sm relative z-10">
          <div className="flex items-center space-x-8" style={{ color: colors.secondary_color }}>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.primary_color }}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{siteSettings.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.primary_color }}>
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{siteSettings.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.primary_color }}>
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{siteSettings.phone}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{siteSettings.working_hours}</span>
            </div>
            <div className="flex space-x-3">
              <a href={siteSettings.facebook_url || "#"} target="_blank" rel="noopener noreferrer" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = colors.accent_color} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={siteSettings.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = colors.accent_color} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href={siteSettings.telegram_url || "#"} target="_blank" rel="noopener noreferrer" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = colors.accent_color} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href={siteSettings.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = colors.accent_color} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href={siteSettings.youtube_url || "#"} target="_blank" rel="noopener noreferrer" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = colors.accent_color} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Split Background */}
        <div className="absolute inset-0 flex">
          <div className="w-3/5" style={{ backgroundColor: '#fff' }}></div>
          <div className="w-2/5" style={{ backgroundColor: colors.primary_color }}></div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white shadow-md transition-all duration-500 ease-out ${isScrolled ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`} style={{ backgroundColor: '#FAFAFA' }}>
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              {siteSettings.logo ? (
                <Image 
                  src={siteSettings.logo.startsWith('/') ? siteSettings.logo : getImageUrl(siteSettings.logo)}
                  alt="Inno8 Logo" 
                  width={150} 
                  height={50}
                  priority
                  style={{ width: 'auto', height: '48px' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/update%20logo.png'
                  }}
                />
              ) : (
                <Image 
                  src="/images/update%20logo.png" 
                  alt="Inno8 Logo" 
                  width={150} 
                  height={50}
                  priority
                  style={{ width: 'auto', height: '48px' }}
                />
              )}
              <span className="text-2xl font-bold">
                <span style={{ color: colors.primary_color }}>{siteSettings.site_name.split(' ')[0]}</span>
                {siteSettings.site_name.split(' ').length > 1 && (
                  <> <span style={{ color: colors.accent_color }}>{siteSettings.site_name.split(' ').slice(1).join(' ')}</span></>
                )}
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8" style={{ backgroundColor: '#FAFAFA' }}>
              {menuItems.map((item, index) => (
                item.children ? (
                  <div key={index} className="relative group">
                    <a href={item.url} className="transition-colors font-medium flex items-center space-x-1 py-2" style={{ color: colors.secondary_color }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = colors.primary_color} onMouseLeave={(e) => (e.target as HTMLElement).style.color = colors.secondary_color}>
                      <span>{item.name}</span>
                      <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>
                    <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform origin-top scale-y-0 group-hover:scale-y-100 z-50">
                      <div className="py-2">
                        {item.children.map((child: any, childIndex: number) => (
                          <a key={childIndex} href={child.url} className="relative block px-4 py-2 transition-colors overflow-hidden group/item" onMouseEnter={(e) => (e.currentTarget.querySelector('span') as HTMLElement)!.style.color = 'white'} onMouseLeave={(e) => (e.currentTarget.querySelector('span') as HTMLElement)!.style.color = colors.secondary_color}>
                            <span className="relative z-10" style={{ color: colors.secondary_color }}>{child.name}</span>
                            <div className="absolute inset-0 transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <a key={index} href={item.url} className="transition-colors font-medium" style={{ color: colors.secondary_color }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = colors.primary_color} onMouseLeave={(e) => (e.target as HTMLElement).style.color = colors.secondary_color}>
                    {item.name}
                  </a>
                )
              ))}
              
              <a href="/contact" className="relative px-6 py-3 rounded-sm font-semibold shadow-sm overflow-hidden group" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
                <span className="relative z-10 group-hover:text-white transition-colors">Get A Quote</span>
                <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              style={{ color: colors.secondary_color }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {(isMenuOpen || showOverlay) && (
            <>
              {/* Dark Overlay */}
              <div 
                className={`fixed inset-0 bg-black z-40 lg:hidden transition-all duration-700 ease-in-out ${
                  showOverlay ? 'opacity-50' : 'opacity-0'
                }`} 
                style={{
                  transform: showOverlay ? 'translateX(0)' : 'translateX(100%)'
                }}
                onClick={closeMenu} 
              />
              
              {/* Mobile Menu */}
              <div className={`fixed top-0 right-0 h-full w-full max-w-sm shadow-xl z-50 lg:hidden transform transition-transform duration-700 ease-in-out overflow-hidden ${
                showMenu ? 'translate-x-0' : 'translate-x-full'
              }`} style={{ backgroundColor: colors.primary_color }}>
                <div className="p-6 h-full overflow-y-auto">
                  {/* Logo, Company Name and Close Button */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      {siteSettings.mobile_logo ? (
                        <Image 
                          src={siteSettings.mobile_logo.startsWith('/') ? siteSettings.mobile_logo : getImageUrl(siteSettings.mobile_logo)}
                          alt="Inno8 Logo" 
                          width={120} 
                          height={40}
                          style={{ width: 'auto', height: '40px' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/inoo8%20With%20Bg.jpg'
                          }}
                        />
                      ) : (
                        <Image 
                          src="/images/inoo8%20With%20Bg.jpg" 
                          alt="Inno8 Logo" 
                          width={120} 
                          height={40}
                          style={{ width: 'auto', height: '40px' }}
                        />
                      )}
                      <span className="text-xl font-bold">
                        <span className="text-white">{siteSettings.site_name.split(' ')[0]}</span>
                        {siteSettings.site_name.split(' ').length > 1 && (
                          <> <span style={{ color: colors.accent_color }}>{siteSettings.site_name.split(' ').slice(1).join(' ')}</span></>
                        )}
                      </span>
                    </div>
                    <button onClick={closeMenu} className="text-white transition-colors hover:opacity-80">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mb-6 pb-4 border-b border-white border-opacity-20">
                    <h3 className="font-semibold mb-3 text-sm text-white">Contact Info</h3>
                    <div className="space-y-2">
                      <a href={`mailto:${siteSettings.email}`} className="flex items-center space-x-2 text-white text-opacity-80 hover:text-opacity-100 transition-colors text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="break-all">{siteSettings.email}</span>
                      </a>
                      <a href={`tel:${siteSettings.phone?.replace(/\s/g, '') || ''}`} className="flex items-center space-x-2 text-white text-opacity-80 hover:text-opacity-100 transition-colors text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{siteSettings.phone}</span>
                      </a>
                      <div className="flex items-center space-x-2 text-white text-opacity-80 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{siteSettings.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Links with Dropdowns */}
                  <div className="space-y-2 mb-6">
                    {menuItems.map((item, index) => (
                      item.children && item.children.length > 0 ? (
                        <div key={index}>
                          <div className="flex items-center justify-between w-full py-2">
                            <a href={item.url} onClick={closeMenu} className="text-white hover:text-opacity-80 transition-colors font-medium flex-1">
                              {item.name}
                            </a>
                            <button 
                              onClick={() => toggleDropdown(item.name.toLowerCase())}
                              className="text-white hover:text-opacity-80 transition-colors p-1 ml-2"
                            >
                              <svg className={`w-4 h-4 transform transition-transform duration-200 ${openDropdown === item.name.toLowerCase() ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          <div className={`overflow-hidden transition-all duration-500 ease-out ${
                            openDropdown === item.name.toLowerCase() ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                            <div className="ml-4 mt-2 space-y-1">
                              {item.children.map((child: any, childIndex: number) => (
                                <a key={childIndex} href={child.url} className="block text-white text-opacity-70 hover:text-opacity-100 transition-colors py-1 text-sm">
                                  {child.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <a key={index} href={item.url} onClick={closeMenu} className="block text-white hover:text-opacity-80 transition-colors font-medium py-2">
                          {item.name}
                        </a>
                      )
                    ))}
                  </div>
                  
                  {/* Get Quote Button */}
                  <a href="/contact" className="relative block w-full px-6 py-4 rounded-sm font-semibold mb-6 overflow-hidden group border border-blue-500 text-white hover:bg-blue-500 transition-all duration-300 text-center">
                    <span className="relative z-10 group-hover:text-black transition-colors">Get A Quote</span>
                    <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.accent_color }}></div>
                  </a>
                  
                  {/* Social Media Icons */}
                  <div className="border-t border-white border-opacity-20 pt-4 mt-6">
                    <h3 className="font-semibold mb-3 text-sm text-white">Follow Us</h3>
                    <div className="grid grid-cols-5 gap-3">
                      <a href={siteSettings.facebook_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href={siteSettings.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a href={siteSettings.telegram_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </a>
                      <a href={siteSettings.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a href={siteSettings.youtube_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>
      </header>
    </>
  )
}