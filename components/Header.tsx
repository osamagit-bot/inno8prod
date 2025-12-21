'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'

interface SiteSettings {
  site_name: string
  email: string
  phone: string
  address: string
  working_hours: string
}

interface MenuItem {
  name: string
  url: string
  children?: MenuItem[]
}

export default function Header() {
  const colors = useColors()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'Inno8 Solutions',
    email: 'info.inno8sh@gmail.com',
    phone: '+93 711 167 380',
    address: 'Kabul, Afghanistan',
    working_hours: '9:00 am - 6:00 pm'
  })
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { 
      name: 'Services', 
      url: '/services',
      children: [
        { name: 'Web Development', url: '/web-development' },
        { name: 'Graphic Design', url: '/graphic-design' },
        { name: 'Video Editing', url: '/video-editing' },
        { name: 'Database Development', url: '/database-development' },
        { name: 'IT Solutions and Technical Support', url: '/it-solutions' }
      ]
    },
    { name: 'Projects', url: '/projects' },
    { name: 'Testimonials', url: '/testimonials' },
    { name: 'Blog', url: '/blog' },
    { name: 'Contact Us', url: '/contact' }
  ])

  useEffect(() => {
    fetchSiteSettings()
    fetchMenuItems()
  }, [])

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch('http://localhost:8010/api/site-settings/')
      if (response.ok) {
        const data = await response.json()
        setSiteSettings(data)
      }
    } catch (error) {
      console.log('Using default site settings')
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8010/api/menu-items/')
      
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const parentItems = data.filter(item => !item.parent).sort((a, b) => a.order - b.order)
          const structuredMenu = parentItems.map(parent => ({
            name: parent.name,
            url: parent.url,
            children: parent.children && parent.children.length > 0 ? parent.children.map(child => ({
              name: child.name,
              url: child.url
            })) : undefined
          }))
          setMenuItems(structuredMenu)
        }
      }
    } catch (error) {
      console.log('Error fetching menu items:', error)
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
      <div className="hidden lg:block text-white py-4 px-6 relative overflow-hidden" style={{ backgroundColor: colors.primary_color }}>
        
        
        <div className="container mx-auto flex justify-between items-center text-sm relative z-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{siteSettings.address}</span>
            </div>
            <a href={`mailto:${siteSettings.email}`} className="flex items-center space-x-2 transition-colors" onMouseEnter={(e) => e.target.style.color = colors.accent_color} onMouseLeave={(e) => e.target.style.color = 'white'}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{siteSettings.email}</span>
            </a>
            <a href={`tel:${siteSettings.phone?.replace(/\s/g, '') || ''}`} className="flex items-center space-x-2 transition-colors" onMouseEnter={(e) => e.target.style.color = colors.accent_color} onMouseLeave={(e) => e.target.style.color = 'white'}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{siteSettings.phone}</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{siteSettings.working_hours}</span>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-2">
              <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = colors.accent_color} onMouseLeave={(e) => e.target.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = colors.accent_color} onMouseLeave={(e) => e.target.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = colors.accent_color} onMouseLeave={(e) => e.target.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = colors.accent_color} onMouseLeave={(e) => e.target.style.color = 'white'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <Image 
                src="/images/update logo.png" 
                alt="Inno8 Logo" 
                width={150} 
                height={50}
                priority
                style={{ width: 'auto', height: '48px' }}
              />
              <span className="text-2xl font-bold">
                <span style={{ color: colors.primary_color }}>{siteSettings.site_name.split(' ')[0]}</span>
                {siteSettings.site_name.split(' ').length > 1 && (
                  <> <span style={{ color: colors.accent_color }}>{siteSettings.site_name.split(' ').slice(1).join(' ')}</span></>
                )}
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                item.children ? (
                  <div key={index} className="relative group">
                    <a href={item.url} className="transition-colors font-medium flex items-center space-x-1 py-2" style={{ color: colors.secondary_color }} onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = colors.secondary_color}>
                      <span>{item.name}</span>
                      <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>
                    <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="py-2">
                        {item.children.map((child, childIndex) => (
                          <a key={childIndex} href={child.url} className="relative block px-4 py-2 transition-colors overflow-hidden group/item" onMouseEnter={(e) => e.currentTarget.querySelector('span').style.color = 'white'} onMouseLeave={(e) => e.currentTarget.querySelector('span').style.color = colors.secondary_color}>
                            <span className="relative z-10" style={{ color: colors.secondary_color }}>{child.name}</span>
                            <div className="absolute inset-0 transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <a key={index} href={item.url} className="transition-colors font-medium" style={{ color: colors.secondary_color }} onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = colors.secondary_color}>
                    {item.name}
                  </a>
                )
              ))}
              
              <button className="relative px-6 py-3 rounded-sm font-semibold shadow-sm overflow-hidden group" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
                <span className="relative z-10 group-hover:text-white transition-colors">Get A Quote</span>
                <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
              </button>
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
              <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-700 ease-in-out overflow-hidden ${
                showMenu ? 'translate-x-0' : 'translate-x-full'
              }`}>
                <div className="p-6 h-full overflow-y-auto">
                  {/* Logo and Company Name */}
                  <div className="flex items-center space-x-3 mb-6">
                    <Image 
                      src="/images/update logo.png" 
                      alt="Inno8 Logo" 
                      width={120} 
                      height={40}
                      style={{ width: 'auto', height: '40px' }}
                    />
                    <span className="text-xl font-bold">
                      <span style={{ color: colors.primary_color }}>{siteSettings.site_name.split(' ')[0]}</span>
                      {siteSettings.site_name.split(' ').length > 1 && (
                        <> <span style={{ color: colors.accent_color }}>{siteSettings.site_name.split(' ').slice(1).join(' ')}</span></>
                      )}
                    </span>
                  </div>
                  
                  {/* Close Button */}
                  <div className="flex justify-end mb-6">
                    <button onClick={closeMenu} className="transition-colors" style={{ color: colors.secondary_color }} onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = colors.secondary_color}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h3 className="font-semibold mb-3 text-sm" style={{ color: colors.secondary_color }}>Contact Info</h3>
                    <div className="space-y-2">
                      <a href={`mailto:${siteSettings.email}`} className="flex items-center space-x-2 text-gray-600 transition-colors text-sm" onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="break-all">{siteSettings.email}</span>
                      </a>
                      <a href={`tel:${siteSettings.phone?.replace(/\s/g, '') || ''}`} className="flex items-center space-x-2 text-gray-600 transition-colors text-sm" onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{siteSettings.phone}</span>
                      </a>
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
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
                      item.children ? (
                        <div key={index}>
                          <button 
                            onClick={() => toggleDropdown(item.name.toLowerCase())}
                            className="flex items-center justify-between w-full transition-colors font-medium py-2 text-left" style={{ color: colors.secondary_color }} onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = colors.secondary_color}
                          >
                            <span>{item.name}</span>
                            <svg className={`w-4 h-4 transform transition-transform duration-200 ${openDropdown === item.name.toLowerCase() ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className={`overflow-hidden transition-all duration-500 ease-out ${
                            openDropdown === item.name.toLowerCase() ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                            <div className="ml-4 mt-2 space-y-1">
                              {item.children.map((child, childIndex) => (
                                <a key={childIndex} href={child.url} className="block text-gray-600 transition-colors py-1 text-sm" onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                                  {child.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <a key={index} href={item.url} className="block transition-colors font-medium py-2" style={{ color: colors.secondary_color }} onMouseEnter={(e) => e.target.style.color = colors.primary_color} onMouseLeave={(e) => e.target.style.color = colors.secondary_color}>
                          {item.name}
                        </a>
                      )
                    ))}
                  </div>
                  
                  {/* Get Quote Button */}
                  <button className="relative w-full px-4 py-3 rounded-lg font-semibold mb-6 overflow-hidden group" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
                    <span className="relative z-10 group-hover:text-white transition-colors">Get A Quote</span>
                    <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                  </button>
                  
                  {/* Social Media Icons */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold mb-3 text-sm" style={{ color: colors.secondary_color }}>Follow Us</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <a href="#" className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg text-gray-600 hover:text-white transition-colors" onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primary_color; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f3f4f6'; e.target.style.color = '#6b7280'; }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href="#" className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg text-gray-600 hover:text-white transition-colors" onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primary_color; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f3f4f6'; e.target.style.color = '#6b7280'; }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a href="#" className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg text-gray-600 hover:text-white transition-colors" onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primary_color; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f3f4f6'; e.target.style.color = '#6b7280'; }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </a>
                      <a href="#" className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg text-gray-600 hover:text-white transition-colors" onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primary_color; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f3f4f6'; e.target.style.color = '#6b7280'; }}>
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