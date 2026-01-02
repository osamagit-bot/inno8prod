'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import { useColors } from '../../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../../lib/api'
import { fallbackData } from '../../lib/fallbackData'

interface Project {
  id: number
  title: string
  description: string
  image: string
  url?: string
  live_preview_url?: string
  technologies: string
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export default function ProjectsPage() {
  const colors = useColors()
  const [projects, setProjects] = useState<Project[]>(fallbackData.projects)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    fetchProjects()
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.filter((p: Project) => p.is_active))
      }
    } catch (error) {
      console.log('Backend offline - using fallback projects')
      setProjects(fallbackData.projects)
    }
    setLoading(false)
  }

  const getCategories = () => {
    const techs = projects.flatMap(p => p.technologies.split(', '))
    const categories = ['All', 'Featured']
    if (techs.some(t => ['React', 'Vue', 'Next', 'Angular'].some(web => t.includes(web)))) {
      categories.push('Web Development')
    }
    if (techs.some(t => t.includes('React Native') || t.includes('Flutter'))) {
      categories.push('Mobile Apps')
    }
    if (techs.some(t => ['Spring', 'Oracle', 'Enterprise'].some(ent => t.includes(ent)))) {
      categories.push('Enterprise')
    }
    return categories
  }
  
  const getFilteredProjects = () => {
    switch (activeFilter) {
      case 'Featured':
        return projects.filter(p => p.is_featured)
      case 'Web Development':
        return projects.filter(p => ['React', 'Vue', 'Next', 'Angular'].some(tech => p.technologies.includes(tech)))
      case 'Mobile Apps':
        return projects.filter(p => p.technologies.includes('React Native') || p.technologies.includes('Flutter'))
      case 'Enterprise':
        return projects.filter(p => ['Spring', 'Oracle', 'Enterprise'].some(tech => p.technologies.includes(tech)))
      default:
        return projects
    }
  }

  const filters = getCategories()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: colors.primary_color }}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff' }}>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackData.subpageHeros.projects})` }}
        ></div>
        
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
              OUR PROJECTS
            </h1>
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">
                HOME
              </a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">PROJECTS</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden group ${
                  activeFilter === filter 
                    ? 'text-white transform scale-105' 
                    : 'text-gray-600 bg-white border border-gray-200'
                }`}
                style={{
                  backgroundColor: activeFilter === filter ? colors.primary_color : 'white'
                }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors">{filter}</span>
                {activeFilter !== filter && (
                  <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                )}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredProjects().map((project, index) => (
              <div
                key={project.id}
                className="group rounded-xl overflow-hidden shadow-sm transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
                style={{ backgroundColor: '#FAFAFA' }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden bg-gray-200 flex-shrink-0">
                  {project.image ? (
                    <Image
                      src={getImageUrl(project.image)}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center"><div class="text-center"><svg class="w-16 h-16 text-gray-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg><p class="text-gray-600 text-sm">No Image Available</p></div></div>';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                  
                  {/* Featured Badge */}
                  {project.is_featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: colors.accent_color }}>
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors" style={{ color: colors.secondary_color }}>
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {project.technologies.split(', ').map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-sm rounded-full"
                        style={{ 
                          backgroundColor: colors.primary_color + '20', 
                          color: colors.primary_color 
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Actions */}
                  <div className="flex items-center justify-between pt-4">
                    <a
                      href={`/projects/${project.id}`}
                      className="relative flex items-center space-x-2 font-medium transition-colors cursor-pointer overflow-hidden group/learn"
                      style={{ color: colors.primary_color }}
                    >
                      <span className="relative z-10">Learn More</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/learn:w-full transition-all duration-300 ease-out" style={{ backgroundColor: colors.primary_color, marginTop: '2px' }}></div>
                    </a>
                     {project.live_preview_url && (
                    <a
                      href={project.live_preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center space-x-2 font-medium transition-colors overflow-hidden group/link"
                      style={{ color: colors.primary_color }}
                    >
                      <span className="relative z-10">Live Preview</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/link:w-full transition-all duration-300 ease-out" style={{ backgroundColor: colors.primary_color, marginTop: '2px' }}></div>
                    </a>
                     )}
                    {!project.live_preview_url && (
                    <a
                      href={project.url || '#'}
                      target={project.url ? '_blank' : '_self'}
                      rel={project.url ? 'noopener noreferrer' : undefined}
                      className="relative flex items-center space-x-2 font-medium transition-colors overflow-hidden group/link"
                      style={{ color: colors.primary_color }}
                    >
                      <span className="relative z-10">Live Preview</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/link:w-full transition-all duration-300 ease-out" style={{ backgroundColor: colors.primary_color, marginTop: '2px' }}></div>
                    </a>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-3xl font-bold mb-4" style={{ color: colors.secondary_color }}>
              Ready to Start Your Project?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can bring your ideas to life with our expertise and innovative solutions.
            </p>
            <a href="/contact" className="relative inline-block px-8 py-4 rounded-sm font-semibold shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
              <span className="relative z-10 group-hover:text-white transition-colors">Get Started Today</span>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}