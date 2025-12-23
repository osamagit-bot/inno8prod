'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'
import Image from 'next/image'

interface Project {
  id: number
  title: string
  description: string
  image: string
  url?: string
  technologies: string
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export default function ProjectsSection() {
  const colors = useColors()
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState('All')

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
      console.log('Error fetching projects:', error)
    }
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
    switch (activeCategory) {
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

  const categories = getCategories()
  const filteredProjects = getFilteredProjects()

  return (
    <section className="py-20" style={{ backgroundColor: '#fff' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 rounded-full mr-4" style={{ backgroundColor: colors.primary_color }}></div>
            <span className="text-lg font-medium" style={{ color: colors.primary_color }}>
              OUR PORTFOLIO
            </span>
            <div className="w-12 h-1 rounded-full ml-4" style={{ backgroundColor: colors.primary_color }}></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.secondary_color }}>
            Featured <span style={{ color: colors.accent_color }}>Projects</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.primary_color }}>
            Discover our latest work and successful project implementations across various industries and technologies.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? 'text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 bg-white hover:shadow-md'
              }`}
              style={{
                backgroundColor: activeCategory === category ? colors.primary_color : 'white',
                borderColor: colors.primary_color
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group rounded-xl overflow-hidden shadow-sm transition-all duration-500 transform hover:-translate-y-2"
              style={{ backgroundColor: '#FAFAFA' }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                {project.image ? (
                  <Image
                    src={getImageUrl(project.image)}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
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
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors" style={{ color: colors.secondary_color }}>
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                <div className="flex items-center justify-between">
                  <span
                    className="flex items-center space-x-2 font-medium transition-colors cursor-pointer"
                    style={{ color: colors.primary_color }}
                  >
                    <span>Learn More</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <a
                    href={project.url}
                    className="relative flex items-center space-x-2 font-medium transition-colors overflow-hidden group/link"
                    style={{ color: colors.primary_color }}
                  >
                    <span className="relative z-10">Live Preview</span>
                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/link:w-full transition-all duration-300 ease-out" style={{ backgroundColor: colors.primary_color, marginTop: '2px' }}></div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
          <button className="relative px-8 py-4 rounded-sm font-semibold shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
            <span className="relative z-10 group-hover:text-white transition-colors">View All Projects</span>
            <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
          </button>
        </div>
      </div>
    </section>
  )
}