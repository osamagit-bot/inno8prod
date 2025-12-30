'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { fetchTeamMembers, getImageUrl } from '../lib/api'
import { fallbackData } from '../lib/fallbackData'

interface TeamMember {
  id: number
  name: string
  position: string
  image: string
  rss_url?: string
  pinterest_url?: string
  google_plus_url?: string
  facebook_url?: string
  twitter_url?: string
}

export default function TeamSection() {
  const colors = useColors()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(fallbackData.teamMembers)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [itemsPerSlide, setItemsPerSlide] = useState(4)

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const membersData = await fetchTeamMembers()
        if (membersData.length > 0) {
          setTeamMembers(membersData)
        }
      } catch (error) {
        console.log('Backend offline - using fallback team data')
        setTeamMembers(fallbackData.teamMembers)
      }
    }
    loadTeamData()
  }, [])

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

  return (
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
                      src={member.image ? (member.image.startsWith('/') ? member.image : getImageUrl(member.image)) : '/images/placeholder-team.jpg'}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNTAgMTYwQzUwIDEzNS4xNDcgNzAuMTQ3IDExNSA5NSAxMTVIMTA1QzEyOS44NTMgMTE1IDE1MCAxMzUuMTQ3IDE1MCAxNjBWMjAwSDUwVjE2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
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
                  key={`dot-${index}`}
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
  )
}